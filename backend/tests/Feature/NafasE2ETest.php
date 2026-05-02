<?php

namespace Tests\Feature;

use App\Models\ContactInquiry;
use App\Models\Coupon;
use App\Models\Customer;
use App\Models\Formula;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\User;
use App\Models\WholesaleInquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NafasE2ETest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }

    private function loginAsRole(string $role): string
    {
        $user = User::factory()->create([
            'name' => ucfirst($role),
            'email' => "{$role}-test@example.test",
            'password' => bcrypt('password123'),
            'role' => $role,
        ]);

        return $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ])->json('token');
    }

    private function assertApiRouteUsesMiddleware(string $method, string $uri, string $middleware): void
    {
        $route = collect(Route::getRoutes())->first(
            fn ($route) => in_array(strtoupper($method), $route->methods(), true) && $route->uri() === ltrim($uri, '/')
        );

        $this->assertNotNull($route, "Route {$method} {$uri} was not registered.");
        $this->assertTrue(
            collect($route->gatherMiddleware())->contains(fn ($registered) => str_contains($registered, $middleware) || str_contains($registered, str_replace('throttle:', '', $middleware))),
            "Route {$method} {$uri} is missing {$middleware}."
        );
    }

    private function activePublicVariant(): ProductVariant
    {
        return ProductVariant::where('is_active', true)
            ->whereHas('product', fn ($query) => $query->where('status', 'active'))
            ->firstOrFail();
    }

    public function test_public_product_detail_does_not_expose_formulas_or_cost_prices(): void
    {
        $product = \App\Models\Product::first();
        Formula::create([
            'product_id' => $product->id,
            'internal_notes' => 'confidential',
            'oil_percentage' => 24,
            'alcohol_percentage' => 76,
        ]);

        $response = $this->getJson("/api/products/{$product->slug}");
        $response->assertOk();
        $response->assertJsonMissingPath('data.formula');
        $response->assertJsonMissingPath('data.variants.0.cost_price');
        $response->assertJsonMissingPath('data.variants.0.wholesale_price');
    }

    public function test_public_page_by_slug_works(): void
    {
        $this->getJson('/api/pages/faq')
            ->assertOk()
            ->assertJsonPath('slug', 'faq');
    }

    public function test_admin_login_works_and_returns_token(): void
    {
        $admin = User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'super-admin-login@example.test',
            'password' => bcrypt('password123'),
            'role' => 'super_admin',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $admin->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $this->assertArrayHasKey('token', $response->json());
    }

    public function test_admin_routes_reject_unauthenticated(): void
    {
        $this->getJson('/api/admin/dashboard')->assertStatus(401);
    }

    public function test_customer_cannot_access_any_admin_route(): void
    {
        $token = $this->loginAsRole('customer');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/dashboard')
            ->assertStatus(403);
    }

    public function test_content_manager_access_matrix(): void
    {
        $token = $this->loginAsRole('content_manager');

        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/pages')->assertOk();
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/settings')->assertOk();
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/inventory/movements')->assertStatus(403);
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/formulas')->assertStatus(403);
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/orders')->assertStatus(403);
    }

    public function test_inventory_manager_access_matrix(): void
    {
        $token = $this->loginAsRole('inventory_manager');

        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/inventory/movements')->assertOk();
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/batches')->assertOk();
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/quality-checks')->assertOk();
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/pages')->assertStatus(403);
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/orders')->assertStatus(403);
    }

    public function test_order_manager_access_matrix(): void
    {
        $token = $this->loginAsRole('order_manager');

        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/orders')->assertOk();
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/customers')->assertOk();
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/coupons')->assertOk();
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/formulas')->assertStatus(403);
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/pages')->assertStatus(403);
        $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/admin/settings')->assertStatus(403);
    }

    public function test_super_admin_can_access_all_tested_route_groups(): void
    {
        $token = $this->loginAsRole('super_admin');

        foreach ([
            '/api/admin/orders',
            '/api/admin/pages',
            '/api/admin/settings',
            '/api/admin/formulas',
            '/api/admin/inventory/movements',
            '/api/admin/batches',
            '/api/admin/quality-checks',
        ] as $route) {
            $this->withHeader('Authorization', 'Bearer ' . $token)->getJson($route)->assertOk();
        }
    }

    public function test_admin_product_crud_works_with_real_token(): void
    {
        $token = $this->loginAsRole('super_admin');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/products', [
                'code' => 'RBAC-001',
                'name_ar' => 'اختبار',
                'name_en' => 'Test',
                'slug' => 'rbac-001',
                'gender' => 'Unisex',
                'status' => 'active',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', ['code' => 'RBAC-001']);
    }

    public function test_server_side_cart_support_works(): void
    {
        $variant = $this->activePublicVariant();

        $add = $this->postJson('/api/cart/items', ['variant_id' => $variant->id, 'quantity' => 2], ['X-Session-Key' => 'session-1']);
        $add->assertCreated();

        $cart = $this->getJson('/api/cart', ['X-Session-Key' => 'session-1']);
        $cart->assertOk()->assertJsonPath('items.0.quantity', 2);

        $cartItemId = $cart->json('items.0.id');
        $this->patchJson("/api/cart/items/{$cartItemId}", ['quantity' => 3], ['X-Session-Key' => 'session-1'])->assertOk();
        $this->deleteJson("/api/cart/items/{$cartItemId}", [], ['X-Session-Key' => 'session-1'])->assertOk();
    }

    public function test_guest_session_cannot_update_or_delete_another_session_cart_item(): void
    {
        $variant = $this->activePublicVariant();

        $this->postJson('/api/cart/items', ['variant_id' => $variant->id, 'quantity' => 2], ['X-Session-Key' => 'session-b'])
            ->assertCreated();

        $cart = $this->getJson('/api/cart', ['X-Session-Key' => 'session-b']);
        $cartItemId = $cart->json('items.0.id');

        $this->patchJson("/api/cart/items/{$cartItemId}", ['quantity' => 3], ['X-Session-Key' => 'session-a'])
            ->assertNotFound();

        $this->deleteJson("/api/cart/items/{$cartItemId}", [], ['X-Session-Key' => 'session-a'])
            ->assertNotFound();

        $this->getJson('/api/cart', ['X-Session-Key' => 'session-b'])
            ->assertOk()
            ->assertJsonPath('items.0.quantity', 2);
    }

    public function test_logged_in_user_cannot_update_or_delete_another_users_cart_item(): void
    {
        $variant = $this->activePublicVariant();
        $userA = User::factory()->create(['role' => 'customer', 'password' => bcrypt('password123')]);
        $userB = User::factory()->create(['role' => 'customer', 'password' => bcrypt('password123')]);
        $tokenA = $this->postJson('/api/auth/login', ['email' => $userA->email, 'password' => 'password123'])->json('token');
        $tokenB = $this->postJson('/api/auth/login', ['email' => $userB->email, 'password' => 'password123'])->json('token');

        $this->withHeader('Authorization', 'Bearer ' . $tokenB)
            ->postJson('/api/cart/items', ['variant_id' => $variant->id, 'quantity' => 2])
            ->assertCreated();

        $cart = $this->withHeader('Authorization', 'Bearer ' . $tokenB)->getJson('/api/cart');
        $cartItemId = $cart->json('items.0.id');

        $this->withHeader('Authorization', 'Bearer ' . $tokenA)
            ->patchJson("/api/cart/items/{$cartItemId}", ['quantity' => 3])
            ->assertNotFound();

        $this->withHeader('Authorization', 'Bearer ' . $tokenA)
            ->deleteJson("/api/cart/items/{$cartItemId}")
            ->assertNotFound();

        $this->withHeader('Authorization', 'Bearer ' . $tokenB)
            ->getJson('/api/cart')
            ->assertOk()
            ->assertJsonPath('items.0.quantity', 2);
    }

    public function test_logged_in_owner_can_update_and_delete_own_cart_item(): void
    {
        $variant = $this->activePublicVariant();
        $user = User::factory()->create(['role' => 'customer', 'password' => bcrypt('password123')]);
        $token = $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'password123'])->json('token');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/cart/items', ['variant_id' => $variant->id, 'quantity' => 1])
            ->assertCreated();

        $cart = $this->withHeader('Authorization', 'Bearer ' . $token)->getJson('/api/cart');
        $cartItemId = $cart->json('items.0.id');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/cart/items/{$cartItemId}", ['quantity' => 2])
            ->assertOk()
            ->assertJsonPath('quantity', 2);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/cart/items/{$cartItemId}")
            ->assertOk();
    }

    public function test_inventory_deduction_and_restoration_lifecycle(): void
    {
        $variant = $this->activePublicVariant();
        $initialStock = $variant->stock_quantity;
        $token = $this->loginAsRole('super_admin');

        $res = $this->postJson('/api/checkout', [
            'customer_name' => 'Test User',
            'phone' => '0123456789',
            'address' => 'Test Addr',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'cash_on_delivery',
            'items' => [['variant_id' => $variant->id, 'quantity' => 5]],
        ]);

        $orderId = $res->json('order.id');
        $variant->refresh();
        $this->assertEquals($initialStock, $variant->stock_quantity);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/orders/{$orderId}/status", ['status' => 'confirmed'])
            ->assertStatus(200);

        $variant->refresh();
        $this->assertEquals($initialStock - 5, $variant->stock_quantity);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/orders/{$orderId}/status", ['status' => 'cancelled'])
            ->assertStatus(200);

        $variant->refresh();
        $this->assertEquals($initialStock, $variant->stock_quantity);
    }

    public function test_duplicate_status_update_does_not_double_mutate_inventory(): void
    {
        $variant = $this->activePublicVariant();
        $initialStock = $variant->stock_quantity;
        $token = $this->loginAsRole('super_admin');

        $orderId = $this->postJson('/api/checkout', [
            'customer_name' => 'Edge Case',
            'phone' => '0123456789',
            'address' => 'Test Addr',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'cash_on_delivery',
            'items' => [['variant_id' => $variant->id, 'quantity' => 2]],
        ])->json('order.id');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/orders/{$orderId}/status", ['status' => 'confirmed'])
            ->assertOk();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/orders/{$orderId}/status", ['status' => 'confirmed'])
            ->assertOk();

        $variant->refresh();
        $this->assertEquals($initialStock - 2, $variant->stock_quantity);
    }

    public function test_checkout_accepts_launch_payment_methods_and_rejects_removed_methods(): void
    {
        $variant = $this->activePublicVariant();
        $basePayload = [
            'customer_name' => 'Launch Customer',
            'phone' => '0123456789',
            'address' => 'Detailed launch address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'items' => [['variant_id' => $variant->id, 'quantity' => 1]],
        ];

        $this->postJson('/api/checkout', $basePayload + [
            'payment_method' => 'cash_on_delivery',
        ])->assertCreated()
            ->assertJsonPath('order.payment.status', 'pending')
            ->assertJsonPath('order.payment.method', 'cash_on_delivery')
            ->assertJsonPath('order.payment.review_status', null);

        $this->postJson('/api/checkout', $basePayload + [
            'payment_method' => 'vodafone_cash',
            'payment_reference' => 'VC-123456',
            'payment_payer_phone' => '01012345678',
        ])->assertCreated()
            ->assertJsonPath('order.payment.status', 'pending_review')
            ->assertJsonPath('order.payment.method', 'vodafone_cash')
            ->assertJsonPath('order.payment.reference', 'VC-123456');

        $this->postJson('/api/checkout', $basePayload + [
            'payment_method' => 'instapay',
            'payment_reference' => 'IPN-7890',
        ])->assertCreated()
            ->assertJsonPath('order.payment.status', 'pending_review')
            ->assertJsonPath('order.payment.method', 'instapay')
            ->assertJsonPath('order.payment.review_status', 'pending');

        $this->postJson('/api/checkout', $basePayload + [
            'payment_method' => 'vodafone_cash',
        ])->assertUnprocessable();

        $this->postJson('/api/checkout', $basePayload + [
            'payment_method' => 'instapay',
        ])->assertUnprocessable();

        $this->postJson('/api/checkout', $basePayload + [
            'payment_method' => 'online_card',
        ])->assertUnprocessable();

        $this->postJson('/api/checkout', $basePayload + [
            'payment_method' => 'bank_transfer',
        ])->assertUnprocessable();
    }

    public function test_manual_payment_checkout_accepts_valid_proof_image(): void
    {
        Storage::fake('local');
        $variant = $this->activePublicVariant();

        $response = $this->post('/api/checkout', [
            'customer_name' => 'Proof Customer',
            'phone' => '0123456789',
            'address' => 'Detailed proof payment address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'vodafone_cash',
            'payment_reference' => 'VC-PROOF-1',
            'payment_proof' => UploadedFile::fake()->image('proof.webp')->size(256),
            'items' => [['variant_id' => $variant->id, 'quantity' => 1]],
        ]);

        $response->assertCreated()
            ->assertJsonPath('order.payment.status', 'pending_review')
            ->assertJsonPath('order.payment.method', 'vodafone_cash');

        $proofPath = $response->json('order.payment.proof_image_path');
        $this->assertNotEmpty($proofPath);
        $this->assertStringStartsWith('payment-proofs/', $proofPath);
        Storage::disk('local')->assertExists($proofPath);
    }

    public function test_checkout_applies_valid_coupon_at_submission(): void
    {
        $variant = $this->activePublicVariant();
        Coupon::create([
            'code' => 'NAFAS10',
            'discount_type' => 'fixed',
            'discount_value' => 25,
            'min_cart_total' => 0,
            'usage_limit' => 5,
            'used_count' => 0,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/checkout', [
            'customer_name' => 'Coupon Customer',
            'phone' => '0123456789',
            'address' => 'Detailed coupon address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'cash_on_delivery',
            'coupon_code' => 'NAFAS10',
            'items' => [['variant_id' => $variant->id, 'quantity' => 1]],
        ])->assertCreated();

        $response->assertJsonPath('order.coupon_code', 'NAFAS10');
        $order = Order::findOrFail($response->json('order.id'));
        $this->assertEquals(25.0, (float) $order->discount_amount);
        $this->assertEquals((float) $variant->retail_price - 25.0, (float) $order->total_amount);
        $this->assertDatabaseHas('coupons', ['code' => 'NAFAS10', 'used_count' => 1]);
    }

    public function test_checkout_rejects_invalid_coupon_at_submission(): void
    {
        $variant = $this->activePublicVariant();

        $this->postJson('/api/checkout', [
            'customer_name' => 'Invalid Coupon',
            'phone' => '0123456789',
            'address' => 'Detailed invalid coupon address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'cash_on_delivery',
            'coupon_code' => 'NOPE',
            'items' => [['variant_id' => $variant->id, 'quantity' => 1]],
        ])->assertUnprocessable()
            ->assertJsonPath('error', 'Invalid coupon code');
    }

    public function test_manual_payment_checkout_rejects_invalid_proof_file_type(): void
    {
        Storage::fake('local');
        $variant = $this->activePublicVariant();

        $this->withHeader('Accept', 'application/json')->post('/api/checkout', [
            'customer_name' => 'Bad Proof',
            'phone' => '0123456789',
            'address' => 'Detailed proof payment address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'instapay',
            'payment_reference' => 'IP-BAD-1',
            'payment_proof' => UploadedFile::fake()->create('proof.txt', 20, 'text/plain'),
            'items' => [['variant_id' => $variant->id, 'quantity' => 1]],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('payment_proof');
    }

    public function test_manual_payment_checkout_rejects_oversized_proof_file(): void
    {
        Storage::fake('local');
        $variant = $this->activePublicVariant();

        $this->withHeader('Accept', 'application/json')->post('/api/checkout', [
            'customer_name' => 'Large Proof',
            'phone' => '0123456789',
            'address' => 'Detailed proof payment address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'vodafone_cash',
            'payment_reference' => 'VC-LARGE-1',
            'payment_proof' => UploadedFile::fake()->image('proof.jpg')->size(3073),
            'items' => [['variant_id' => $variant->id, 'quantity' => 1]],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('payment_proof');
    }

    public function test_cod_checkout_rejects_payment_proof_upload(): void
    {
        Storage::fake('local');
        $variant = $this->activePublicVariant();

        $this->withHeader('Accept', 'application/json')->post('/api/checkout', [
            'customer_name' => 'COD Proof',
            'phone' => '0123456789',
            'address' => 'Detailed cod payment address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'cash_on_delivery',
            'payment_proof' => UploadedFile::fake()->image('proof.png')->size(128),
            'items' => [['variant_id' => $variant->id, 'quantity' => 1]],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('payment_proof');
    }

    public function test_admin_can_download_manual_payment_proof_but_public_cannot(): void
    {
        Storage::fake('local');
        $variant = $this->activePublicVariant();
        $token = $this->loginAsRole('order_manager');

        $orderId = $this->post('/api/checkout', [
            'customer_name' => 'Download Proof',
            'phone' => '0123456789',
            'address' => 'Detailed proof payment address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'instapay',
            'payment_reference' => 'IP-DOWNLOAD-1',
            'payment_proof' => UploadedFile::fake()->image('proof.png')->size(128),
            'items' => [['variant_id' => $variant->id, 'quantity' => 1]],
        ])->assertCreated()->json('order.id');

        $this->getJson("/api/admin/orders/{$orderId}/payment-proof")->assertUnauthorized();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->get("/api/admin/orders/{$orderId}/payment-proof")
            ->assertOk();
    }

    public function test_manual_payment_review_can_be_approved_by_order_admin(): void
    {
        $variant = $this->activePublicVariant();
        $token = $this->loginAsRole('order_manager');

        $orderId = $this->postJson('/api/checkout', [
            'customer_name' => 'Manual Pay',
            'phone' => '0123456789',
            'address' => 'Detailed manual payment address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'vodafone_cash',
            'payment_reference' => 'VC-REVIEW-1',
            'payment_payer_phone' => '01012345678',
            'items' => [['variant_id' => $variant->id, 'quantity' => 1]],
        ])->assertCreated()->json('order.id');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/orders/{$orderId}/payment-review", [
                'review_status' => 'approved',
                'admin_note' => 'Matched manual transfer.',
            ])
            ->assertOk()
            ->assertJsonPath('order.payment.status', 'approved')
            ->assertJsonPath('order.payment.review_status', 'approved')
            ->assertJsonPath('order.payment.admin_note', 'Matched manual transfer.');
    }

    public function test_launch_catalog_contains_six_public_perfumes_discovery_set_and_gift_boxes_only(): void
    {
        $publicProducts = Product::where('status', 'active')->pluck('slug')->all();

        $this->assertEqualsCanonicalizing([
            'sharara',
            'madar',
            'athar',
            'barq',
            'nada',
            'ghayma',
            'discovery-set',
            'men-gift-box',
            'women-gift-box',
            'discovery-gift-box',
        ], $publicProducts);

        $this->assertDatabaseHas('products', ['slug' => 'dafwa', 'status' => 'hidden']);
        $this->assertDatabaseHas('products', ['slug' => 'zell', 'status' => 'hidden']);

        foreach (['sharara', 'madar', 'athar', 'barq'] as $slug) {
            $product = Product::where('slug', $slug)->firstOrFail();
            $this->assertEquals([199.0, 319.0, 529.0], $product->variants()->where('is_active', true)->orderBy('size_ml')->pluck('retail_price')->map(fn ($price) => (float) $price)->all());
        }

        foreach (['nada', 'ghayma'] as $slug) {
            $product = Product::where('slug', $slug)->firstOrFail();
            $this->assertEquals([199.0, 299.0, 499.0], $product->variants()->where('is_active', true)->orderBy('size_ml')->pluck('retail_price')->map(fn ($price) => (float) $price)->all());
        }

        $discoverySet = Product::where('slug', 'discovery-set')->firstOrFail();
        $this->assertEquals(149.0, (float) $discoverySet->variants()->where('is_active', true)->firstOrFail()->retail_price);

        $this->assertEquals(699.0, (float) Product::where('slug', 'men-gift-box')->firstOrFail()->variants()->where('is_active', true)->firstOrFail()->retail_price);
        $this->assertEquals(649.0, (float) Product::where('slug', 'women-gift-box')->firstOrFail()->variants()->where('is_active', true)->firstOrFail()->retail_price);
        $this->assertEquals(249.0, (float) Product::where('slug', 'discovery-gift-box')->firstOrFail()->variants()->where('is_active', true)->firstOrFail()->retail_price);
    }

    public function test_cart_validation_blocks_out_of_stock_and_stale_price(): void
    {
        $variant = $this->activePublicVariant();
        $variant->stock_quantity = 2;
        $variant->save();

        $response = $this->postJson('/api/cart/validate', [
            'items' => [['variant_id' => $variant->id, 'quantity' => 10, 'price' => 1]],
        ]);

        $response->assertStatus(200);
        $this->assertFalse($response->json('valid'));
    }

    public function test_customer_cannot_access_other_customer_order(): void
    {
        $owner = User::factory()->create(['role' => 'customer', 'password' => bcrypt('password123')]);
        $other = User::factory()->create(['role' => 'customer', 'password' => bcrypt('password123')]);
        $ownerCustomer = Customer::create(['user_id' => $owner->id, 'name' => 'Owner', 'email' => $owner->email]);
        $order = Order::create([
            'order_number' => 'ORD-OWNER-1',
            'customer_id' => $ownerCustomer->id,
            'customer_name' => 'Owner',
            'customer_phone' => '01000000000',
            'customer_email' => $owner->email,
            'address' => 'Address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'subtotal_amount' => 100,
            'discount_amount' => 0,
            'shipping_amount' => 0,
            'total_amount' => 100,
            'status' => 'pending',
            'payment_method' => 'cash_on_delivery',
            'stock_deducted' => false,
        ]);
        $token = $this->postJson('/api/auth/login', ['email' => $other->email, 'password' => 'password123'])->json('token');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/me/orders/{$order->id}")
            ->assertStatus(404);
    }

    public function test_safe_order_lookup_by_number_requires_matching_identity(): void
    {
        $owner = User::factory()->create(['role' => 'customer']);
        $ownerCustomer = Customer::create(['user_id' => $owner->id, 'name' => 'Lookup', 'email' => 'lookup@example.com']);
        $order = Order::create([
            'order_number' => 'ORD-LOOKUP-1',
            'customer_id' => $ownerCustomer->id,
            'customer_name' => 'Lookup',
            'customer_phone' => '0100',
            'customer_email' => 'lookup@example.com',
            'address' => 'Address',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'subtotal_amount' => 100,
            'discount_amount' => 0,
            'shipping_amount' => 0,
            'total_amount' => 100,
            'status' => 'pending',
            'payment_method' => 'cash_on_delivery',
            'stock_deducted' => false,
        ]);

        $this->getJson("/api/orders/confirmation/{$order->order_number}?phone=0100")->assertOk();
        $this->getJson("/api/orders/confirmation/{$order->order_number}?phone=9999")->assertStatus(404);
    }

    public function test_contact_inquiry_is_stored(): void
    {
        $this->postJson('/api/contact', [
            'name' => 'Ahmed',
            'phone' => '0100',
            'email' => 'ahmed@example.com',
            'message' => 'Need help',
        ])->assertCreated();

        $this->assertDatabaseCount((new ContactInquiry())->getTable(), 1);
    }

    public function test_wholesale_inquiry_is_stored(): void
    {
        $this->postJson('/api/wholesale-inquiry', [
            'name' => 'Retailer',
            'phone' => '0100',
            'email' => 'retailer@example.com',
        ])->assertCreated();

        $this->assertDatabaseCount((new WholesaleInquiry())->getTable(), 1);
    }

    public function test_new_review_is_pending_and_not_public_until_approved(): void
    {
        $product = Product::where('status', 'active')->first();

        $this->postJson("/api/products/{$product->slug}/reviews", [
            'author_name' => 'Ahmed',
            'rating' => 5,
            'body' => 'Balanced and elegant.',
        ])->assertCreated()
            ->assertJsonPath('message', 'Review submitted for moderation');

        $this->assertDatabaseHas('reviews', [
            'product_id' => $product->id,
            'author_name' => 'Ahmed',
            'status' => 'pending',
            'is_approved' => false,
        ]);

        $this->getJson("/api/products/{$product->slug}/reviews")
            ->assertOk()
            ->assertJsonPath('data', []);
    }

    public function test_approved_review_is_public(): void
    {
        $product = Product::where('status', 'active')->first();

        Review::create([
            'product_id' => $product->id,
            'author_name' => 'Approved Customer',
            'rating' => 5,
            'body' => 'Soft trail.',
            'comment' => 'Soft trail.',
            'status' => 'approved',
            'is_approved' => true,
            'likes' => 0,
            'dislikes' => 0,
        ]);

        $this->getJson("/api/products/{$product->slug}/reviews")
            ->assertOk()
            ->assertJsonPath('data.0.author_name', 'Approved Customer');
    }

    public function test_review_replies_follow_moderation_rules(): void
    {
        $product = Product::where('status', 'active')->first();
        $review = Review::create([
            'product_id' => $product->id,
            'author_name' => 'Parent Review',
            'rating' => 5,
            'body' => 'Parent body.',
            'comment' => 'Parent body.',
            'status' => 'approved',
            'is_approved' => true,
            'likes' => 0,
            'dislikes' => 0,
        ]);

        $this->postJson("/api/reviews/{$review->id}/replies", [
            'author_name' => 'Reply Customer',
            'body' => 'I agree.',
        ])->assertCreated();

        $this->assertDatabaseHas('reviews', [
            'parent_id' => $review->id,
            'author_name' => 'Reply Customer',
            'status' => 'pending',
            'is_approved' => false,
        ]);

        $this->getJson("/api/reviews/{$review->id}/replies")
            ->assertOk()
            ->assertJsonPath('data', []);

        $reply = Review::where('parent_id', $review->id)->firstOrFail();
        $reply->update(['status' => 'approved', 'is_approved' => true]);

        $this->getJson("/api/reviews/{$review->id}/replies")
            ->assertOk()
            ->assertJsonPath('data.0.author_name', 'Reply Customer');
    }

    public function test_public_write_and_lookup_routes_are_rate_limited(): void
    {
        foreach ([
            ['POST', 'api/contact', 'throttle:public-writes'],
            ['POST', 'api/wholesale-inquiry', 'throttle:public-writes'],
            ['POST', 'api/products/{slug}/reviews', 'throttle:public-writes'],
            ['POST', 'api/reviews/{review}/replies', 'throttle:public-writes'],
            ['POST', 'api/reviews/{review}/vote', 'throttle:public-writes'],
            ['GET', 'api/orders/confirmation/{orderNumber}', 'throttle:public-lookups'],
        ] as [$method, $uri, $middleware]) {
            $this->assertApiRouteUsesMiddleware($method, $uri, $middleware);
        }
    }
}
