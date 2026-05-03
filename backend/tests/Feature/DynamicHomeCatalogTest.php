<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\HomeSection;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DynamicHomeCatalogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }

    private function token(): string
    {
        return (string) $this->postJson('/api/auth/login', [
            'email' => 'admin@nafas.com',
            'password' => 'password123',
        ])->json('token');
    }

    public function test_public_homepage_returns_active_ordered_sections_with_safe_products(): void
    {
        $response = $this->getJson('/api/homepage')->assertOk();

        $response->assertJsonFragment(['section_key' => 'ritual']);
        $response->assertJsonFragment(['section_key' => 'product-viewer']);
        $response->assertJsonFragment(['slug' => 'sharara']);
        $response->assertJsonMissing(['internal_reference']);
        $response->assertJsonMissing(['internal_notes']);
        $response->assertJsonMissing(['cost_material_per_bottle']);
        $response->assertJsonMissing(['formula']);
    }

    public function test_admin_can_crud_home_sections_and_items(): void
    {
        $token = $this->token();
        $product = Product::where('slug', 'sharara')->firstOrFail();

        $sectionId = $this->withToken($token)->postJson('/api/admin/home-sections', [
            'section_key' => 'launch-note',
            'type' => 'feature',
            'title_ar' => 'رسالة إطلاق',
            'title_en' => 'Launch note',
            'sort_order' => 999,
            'is_active' => true,
        ])->assertCreated()->json('data.id');

        $itemId = $this->withToken($token)->postJson("/api/admin/home-sections/{$sectionId}/items", [
            'product_id' => $product->id,
            'title_ar' => 'شرارة',
            'sort_order' => 10,
            'is_active' => true,
        ])->assertCreated()->json('data.id');

        $this->withToken($token)->patchJson("/api/admin/home-section-items/{$itemId}", [
            'title_ar' => 'شرارة مميزة',
            'sort_order' => 20,
            'is_active' => true,
        ])->assertOk()->assertJsonPath('data.title_ar', 'شرارة مميزة');

        $this->withToken($token)->deleteJson("/api/admin/home-section-items/{$itemId}")->assertNoContent();
        $this->withToken($token)->deleteJson("/api/admin/home-sections/{$sectionId}")->assertNoContent();
    }

    public function test_catalog_public_endpoints_return_active_products_only(): void
    {
        $this->getJson('/api/catalogs')->assertOk()->assertJsonFragment(['slug' => 'nafas-signature']);

        $this->getJson('/api/catalogs/nafas-signature/products')
            ->assertOk()
            ->assertJsonFragment(['slug' => 'sharara'])
            ->assertJsonMissing(['slug' => 'dafwa'])
            ->assertJsonMissing(['internal_reference'])
            ->assertJsonMissing(['internal_notes']);
    }

    public function test_admin_can_crud_catalog_and_attach_product(): void
    {
        $token = $this->token();
        $product = Product::where('slug', 'madar')->firstOrFail();

        $catalogId = $this->withToken($token)->postJson('/api/admin/catalogs', [
            'slug' => 'seasonal-tests',
            'name_ar' => 'اختبارات موسمية',
            'name_en' => 'Seasonal tests',
            'sort_order' => 200,
            'is_active' => true,
        ])->assertCreated()->json('data.id');

        $pivotId = $this->withToken($token)->postJson("/api/admin/catalogs/{$catalogId}/products", [
            'product_id' => $product->id,
            'sort_order' => 10,
            'is_featured' => true,
        ])->assertCreated()->json('data.id');

        $this->assertDatabaseHas('catalog_product', [
            'catalog_id' => $catalogId,
            'product_id' => $product->id,
        ]);

        $this->withToken($token)->patchJson("/api/admin/catalog-products/{$pivotId}", [
            'sort_order' => 30,
            'is_featured' => false,
        ])->assertOk()->assertJsonPath('data.sort_order', 30);

        $this->withToken($token)->deleteJson("/api/admin/catalog-products/{$pivotId}")->assertNoContent();
        $this->withToken($token)->deleteJson("/api/admin/catalogs/{$catalogId}")->assertNoContent();
    }

    public function test_public_product_resource_hides_internal_expansion_fields(): void
    {
        Product::where('slug', 'sharara')->firstOrFail()->update([
            'internal_reference' => 'PRIVATE-SHEET-ROW-9',
            'internal_notes' => 'Never public',
            'product_type' => 'nafas_signature',
            'show_on_home' => true,
            'show_in_shop' => true,
            'home_link_url' => '/products/sharara',
            'home_image_url' => 'https://cdn.nafas.test/sharara-home.jpg',
        ]);

        $this->getJson('/api/products/sharara')
            ->assertOk()
            ->assertJsonPath('data.product_type', 'nafas_signature')
            ->assertJsonPath('data.show_in_shop', true)
            ->assertJsonPath('data.show_on_home', true)
            ->assertJsonPath('data.home_link_url', '/products/sharara')
            ->assertJsonPath('data.home_image_url', 'https://cdn.nafas.test/sharara-home.jpg')
            ->assertJsonMissing(['PRIVATE-SHEET-ROW-9'])
            ->assertJsonMissing(['Never public'])
            ->assertJsonMissing(['internal_reference'])
            ->assertJsonMissing(['internal_notes']);
    }

    public function test_public_shop_respects_product_shop_visibility(): void
    {
        Product::where('slug', 'sharara')->firstOrFail()->update([
            'show_in_shop' => false,
        ]);

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonMissing(['slug' => 'sharara']);

        $this->getJson('/api/products/sharara')
            ->assertOk()
            ->assertJsonPath('data.slug', 'sharara');
    }

    public function test_admin_can_add_product_media_from_uploads_and_url(): void
    {
        Storage::fake('public');

        $token = $this->token();
        $product = Product::where('slug', 'sharara')->firstOrFail();

        $this->withToken($token)->post("/api/admin/products/{$product->id}/media", [
            'files' => [
                UploadedFile::fake()->image('bottle-front.jpg', 900, 1200),
                UploadedFile::fake()->image('bottle-side.webp', 900, 1200),
            ],
            'alt_text' => 'شرارة - صور المنتج',
            'is_primary' => true,
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.type', 'image')
            ->assertJsonPath('data.0.is_primary', true)
            ->assertJsonPath('data.1.is_primary', false);

        $this->assertDatabaseCount('product_media', 2);

        $this->withToken($token)->postJson("/api/admin/products/{$product->id}/media", [
            'url' => 'https://cdn.nafas.test/sharara-launch.mp4',
            'type' => 'video',
            'alt_text' => 'شرارة - فيديو قصير',
            'is_primary' => false,
        ])
            ->assertCreated()
            ->assertJsonPath('type', 'video')
            ->assertJsonPath('url', 'https://cdn.nafas.test/sharara-launch.mp4');

        $this->assertDatabaseHas('product_media', [
            'product_id' => $product->id,
            'type' => 'video',
            'url' => 'https://cdn.nafas.test/sharara-launch.mp4',
        ]);
    }
}
