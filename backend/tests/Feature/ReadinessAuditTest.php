<?php

namespace Tests\Feature;

use App\Models\Coupon;
use App\Models\Formula;
use App\Models\FormulaItem;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductionBatch;
use App\Models\QualityCheck;
use App\Models\User;
use App\Http\Controllers\CheckoutController;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Tests\TestCase;

class ReadinessAuditTest extends TestCase
{
    use RefreshDatabase;

    private array $coreSlugs = ['sharara', 'madar', 'athar', 'barq', 'nada', 'ghayma'];

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }

    private function adminToken(): string
    {
        return (string) $this->postJson('/api/auth/login', [
            'email' => 'admin@nafas.com',
            'password' => 'password123',
        ])->json('token');
    }

    private function activeVariant(string $slug = 'sharara'): ProductVariant
    {
        return Product::query()
            ->where('slug', $slug)
            ->firstOrFail()
            ->variants()
            ->where('is_active', true)
            ->firstOrFail();
    }

    private function checkoutPayload(ProductVariant $variant, int $quantity = 1, array $overrides = []): array
    {
        return array_merge([
            'customer_name' => 'Readiness Customer',
            'phone' => '01000000000',
            'email' => 'readiness@example.com',
            'address' => '12 Oud Street',
            'city' => 'Cairo',
            'governorate' => 'Cairo',
            'payment_method' => 'cash_on_delivery',
            'items' => [
                ['variant_id' => $variant->id, 'quantity' => $quantity],
            ],
        ], $overrides);
    }

    public function test_seeded_public_catalog_contains_core_nafas_products_with_active_variants(): void
    {
        $response = $this->getJson('/api/products');

        $response->assertOk();

        foreach ($this->coreSlugs as $slug) {
            $response->assertJsonFragment(['slug' => $slug]);

            $product = Product::query()->where('slug', $slug)->where('status', 'active')->first();

            $this->assertNotNull($product, "Expected seeded active product {$slug}");
            $this->assertTrue(
                $product->variants()
                    ->where('is_active', true)
                    ->where('retail_price', '>', 0)
                    ->where('stock_quantity', '>=', 0)
                    ->where('size_ml', '>', 0)
                    ->whereNotNull('sku')
                    ->exists(),
                "Expected active sellable variant for {$slug}"
            );
        }

        $this->assertCount(7, $response->json('data'));
        $response->assertJsonFragment(['slug' => 'discovery-set']);
        $this->assertCount(6, Product::query()
            ->whereIn('slug', $this->coreSlugs)
            ->where('status', 'active')
            ->get());
        $response->assertJsonMissing(['slug' => 'dafwa']);
        $response->assertJsonMissing(['slug' => 'zell']);
        $this->assertDatabaseHas('products', ['slug' => 'dafwa', 'status' => 'hidden']);
        $this->assertDatabaseHas('products', ['slug' => 'zell', 'status' => 'hidden']);
        $this->assertDatabaseHas('product_variants', ['sku' => 'NFS-DS-001', 'retail_price' => 149]);
    }

    public function test_public_product_show_works_for_all_core_scents(): void
    {
        foreach ($this->coreSlugs as $slug) {
            $this->getJson("/api/products/{$slug}")
                ->assertOk()
                ->assertJsonPath('data.slug', $slug)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'slug',
                        'name_ar',
                        'name_en',
                        'variants' => [
                            '*' => ['id', 'sku', 'size_ml', 'retail_price', 'stock_quantity', 'is_active'],
                        ],
                    ],
                ]);
        }
    }

    public function test_inactive_products_and_variants_are_not_publicly_available(): void
    {
        $product = Product::create([
            'code' => 'HIDDEN-001',
            'slug' => 'hidden-scent',
            'name_ar' => 'Hidden',
            'name_en' => 'Hidden',
            'gender' => 'Unisex',
            'status' => 'hidden',
        ]);

        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'sku' => 'HIDDEN-001-50',
            'size_ml' => 50,
            'retail_price' => 850,
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $this->getJson('/api/products/hidden-scent')->assertNotFound();
        $this->getJson('/api/products')->assertJsonMissing(['slug' => 'hidden-scent']);

        $this->postJson('/api/cart/validate', [
            'items' => [['variant_id' => $variant->id, 'quantity' => 1, 'price' => 850]],
        ])
            ->assertOk()
            ->assertJsonPath('valid', false)
            ->assertJsonPath('items.0.available', false);
    }

    public function test_cart_validation_accepts_valid_active_variant(): void
    {
        $variant = $this->activeVariant('sharara');

        $this->postJson('/api/cart/validate', [
            'items' => [[
                'variant_id' => $variant->id,
                'quantity' => 1,
                'price' => $variant->retail_price,
            ]],
        ])
            ->assertOk()
            ->assertJsonPath('valid', true)
            ->assertJsonPath('items.0.available', true);
    }

    public function test_cart_validation_rejects_stale_unavailable_and_insufficient_stock_items(): void
    {
        $variant = $this->activeVariant('ghayma');
        $variant->forceFill(['stock_quantity' => 1])->save();

        $inactiveVariant = $this->activeVariant('madar');
        $inactiveVariant->forceFill(['is_active' => false])->save();

        $this->postJson('/api/cart/validate', [
            'items' => [
                ['variant_id' => $variant->id, 'quantity' => 2, 'price' => $variant->retail_price],
                ['variant_id' => $variant->id, 'quantity' => 1, 'price' => $variant->retail_price + 1],
                ['variant_id' => $inactiveVariant->id, 'quantity' => 1, 'price' => $inactiveVariant->retail_price],
            ],
        ])
            ->assertOk()
            ->assertJsonPath('valid', false)
            ->assertJsonPath('items.0.available', false)
            ->assertJsonPath('items.1.stale_price', true)
            ->assertJsonPath('items.2.available', false);
    }

    public function test_checkout_creates_order_items_and_cash_on_delivery_payment(): void
    {
        $variant = $this->activeVariant('madar');

        $response = $this->postJson('/api/checkout', $this->checkoutPayload($variant, 2));

        $response->assertCreated()
            ->assertJsonPath('order.status', 'pending')
            ->assertJsonPath('order.payment.provider', 'cash_on_delivery');

        $orderId = $response->json('order.id');

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'payment_method' => 'cash_on_delivery',
            'stock_deducted' => false,
        ]);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $orderId,
            'product_variant_id' => $variant->id,
            'quantity' => 2,
        ]);
        $this->assertDatabaseHas('payments', [
            'order_id' => $orderId,
            'provider' => 'cash_on_delivery',
        ]);
    }

    public function test_checkout_accepts_manual_wallet_payments_for_admin_review(): void
    {
        $variant = $this->activeVariant('sharara');

        foreach (['vodafone_cash', 'instapay'] as $method) {
            $response = $this->postJson('/api/checkout', $this->checkoutPayload($variant, 1, [
                'payment_method' => $method,
                'payment_reference' => strtoupper($method) . '-REF-123',
            ]));

            $response->assertCreated()
                ->assertJsonPath('order.payment.provider', $method)
                ->assertJsonPath('order.payment.status', 'pending_review');

            $this->assertDatabaseHas('payments', [
                'provider' => $method,
                'reference' => strtoupper($method) . '-REF-123',
                'status' => 'pending_review',
            ]);
        }
    }

    public function test_checkout_rejects_insufficient_stock_and_invalid_coupon(): void
    {
        $variant = $this->activeVariant('barq');
        $variant->forceFill(['stock_quantity' => 0])->save();

        $this->postJson('/api/checkout', $this->checkoutPayload($variant))
            ->assertStatus(422);

        $validVariant = $this->activeVariant('sharara');

        $this->postJson('/api/checkout', $this->checkoutPayload($validVariant, 1, [
            'coupon_code' => 'NOT-A-COUPON',
        ]))->assertStatus(422);
    }

    public function test_order_confirmation_lookup_works_for_guest_order(): void
    {
        $variant = $this->activeVariant('sharara');
        $order = $this->postJson('/api/checkout', $this->checkoutPayload($variant))
            ->assertCreated()
            ->json('order');

        $this->getJson("/api/orders/confirmation/{$order['order_number']}?phone=01000000000")
            ->assertOk()
            ->assertJsonPath('order_number', $order['order_number']);
    }

    public function test_auth_register_login_and_me_work(): void
    {
        $email = 'customer-readiness@example.com';

        $register = $this->postJson('/api/auth/register', [
            'name' => 'Customer Readiness',
            'email' => $email,
            'password' => 'password123',
        ]);

        $register->assertCreated()
            ->assertJsonPath('user.role', 'customer');

        $login = $this->postJson('/api/auth/login', [
            'email' => $email,
            'password' => 'password123',
        ]);

        $login->assertOk();

        $this->withHeader('Authorization', 'Bearer ' . $login->json('token'))
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('email', $email);
    }

    public function test_admin_role_middleware_blocks_non_admin_users(): void
    {
        $user = User::factory()->create([
            'role' => 'customer',
            'password' => bcrypt('password123'),
        ]);

        $token = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ])->json('token');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/dashboard')
            ->assertForbidden();
    }

    public function test_order_fulfillment_statuses_deduct_stock_once(): void
    {
        $token = $this->adminToken();

        foreach (['confirmed', 'preparing', 'shipped', 'delivered'] as $status) {
            $variant = $this->activeVariant('sharara');
            $variant->forceFill(['stock_quantity' => 20])->save();
            $initialStock = $variant->stock_quantity;

            $orderId = $this->postJson('/api/checkout', $this->checkoutPayload($variant, 2))
                ->assertCreated()
                ->json('order.id');

            $this->withHeader('Authorization', 'Bearer ' . $token)
                ->patchJson("/api/admin/orders/{$orderId}/status", ['status' => $status])
                ->assertOk();

            $variant->refresh();
            $this->assertSame($initialStock - 2, $variant->stock_quantity);
            $this->assertTrue((bool) Order::findOrFail($orderId)->stock_deducted);
        }
    }

    public function test_order_cancellation_and_refund_restore_stock_once(): void
    {
        $token = $this->adminToken();

        foreach (['cancelled', 'refunded'] as $restoreStatus) {
            $variant = $this->activeVariant('ghayma');
            $variant->forceFill(['stock_quantity' => 15])->save();

            $orderId = $this->postJson('/api/checkout', $this->checkoutPayload($variant, 3))
                ->assertCreated()
                ->json('order.id');

            $this->withHeader('Authorization', 'Bearer ' . $token)
                ->patchJson("/api/admin/orders/{$orderId}/status", ['status' => 'confirmed'])
                ->assertOk();

            $this->withHeader('Authorization', 'Bearer ' . $token)
                ->patchJson("/api/admin/orders/{$orderId}/status", ['status' => $restoreStatus])
                ->assertOk();

            $this->withHeader('Authorization', 'Bearer ' . $token)
                ->patchJson("/api/admin/orders/{$orderId}/status", ['status' => $restoreStatus])
                ->assertOk();

            $variant->refresh();
            $this->assertSame(15, $variant->stock_quantity);
            $this->assertFalse((bool) Order::findOrFail($orderId)->stock_deducted);
        }
    }

    public function test_admin_dashboard_and_operational_indexes_return_required_data(): void
    {
        $token = $this->adminToken();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/dashboard')
            ->assertOk()
            ->assertJsonStructure([
                'orders_count',
                'products_count',
                'customers_count',
                'total_sales',
                'pending_orders',
                'delivered_orders',
                'average_order_value',
                'today_revenue',
                'month_revenue',
                'new_orders_count',
                'recent_orders',
                'critical_stock',
                'low_stock',
                'top_products_month',
            ]);

        foreach ([
            '/api/admin/products',
            '/api/admin/orders',
            '/api/admin/coupons',
            '/api/admin/pages',
            '/api/admin/settings',
            '/api/admin/formulas',
            '/api/admin/batches',
            '/api/admin/quality-checks',
            '/api/admin/ingredients',
            '/api/admin/inventory/low-stock',
            '/api/admin/inventory/movements',
            '/api/admin/analytics/sales',
            '/api/admin/analytics/products',
            '/api/admin/customers',
        ] as $route) {
            $this->withHeader('Authorization', 'Bearer ' . $token)
                ->getJson($route)
                ->assertOk();
        }
    }

    public function test_admin_product_update_disable_and_delete_flow(): void
    {
        $token = $this->adminToken();

        $productId = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/products', [
                'code' => 'READY-CRUD-001',
                'slug' => 'ready-crud-scent',
                'name_ar' => 'جاهزية',
                'name_en' => 'Readiness Scent',
                'gender' => 'Unisex',
                'status' => 'active',
            ])
            ->assertCreated()
            ->json('id');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/products/{$productId}", [
                'name_en' => 'Readiness Scent Updated',
                'marketing_line_ar' => 'اختبار آمن للوحة التحكم',
            ])
            ->assertOk()
            ->assertJsonPath('name_en', 'Readiness Scent Updated');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/products/{$productId}", ['status' => 'hidden'])
            ->assertOk()
            ->assertJsonPath('status', 'hidden');

        $this->getJson('/api/products/ready-crud-scent')->assertNotFound();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/admin/products/{$productId}")
            ->assertOk();

        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }

    public function test_admin_coupon_create_and_update_flow(): void
    {
        $token = $this->adminToken();

        $couponId = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/coupons', [
                'code' => 'READY15',
                'discount_type' => 'percentage',
                'discount_value' => 15,
                'min_cart_total' => 500,
                'usage_limit' => 20,
                'is_active' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('code', 'READY15')
            ->json('id');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/coupons/{$couponId}", [
                'discount_value' => 10,
                'is_active' => false,
            ])
            ->assertOk()
            ->assertJsonPath('discount_value', 10)
            ->assertJsonPath('is_active', false);
    }

    public function test_admin_formula_batch_and_quality_write_flows(): void
    {
        $token = $this->adminToken();
        $product = Product::where('slug', 'sharara')->firstOrFail();
        $variant = $this->activeVariant('sharara');
        $variant->forceFill(['stock_quantity' => 12])->save();

        $formulaId = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/formulas', [
                'product_id' => $product->id,
                'oil_percentage' => 24,
                'alcohol_percentage' => 76,
                'ifra_status' => 'documented',
                'sds_status' => 'documented',
                'internal_notes' => 'Readiness test formula',
            ])
            ->assertCreated()
            ->assertJsonPath('product_id', $product->id)
            ->json('id');

        $ingredientId = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/ingredients', [
                'name' => 'Readiness Amber',
                'unit' => 'gram',
                'supplier_name' => 'Nafas QA',
                'is_active' => true,
            ])
            ->assertCreated()
            ->json('id');

        $formulaItemId = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/admin/formulas/{$formulaId}/items", [
                'ingredient_id' => $ingredientId,
                'ingredient_name' => 'Readiness Amber',
                'quantity_ml' => 2.5,
                'quantity_grams' => 2.1,
                'cost_per_gram' => 3.25,
                'percentage' => 4.5,
            ])
            ->assertCreated()
            ->json('id');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/items/{$formulaItemId}", [
                'percentage' => 5.0,
                'internal_notes' => 'Adjusted during readiness audit',
            ])
            ->assertOk()
            ->assertJsonPath('percentage', 5);

        $batchId = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/batches', [
                'product_id' => $product->id,
                'product_variant_id' => $variant->id,
                'quantity_produced' => 7,
                'mix_date' => now()->toDateString(),
                'notes' => 'Readiness batch',
            ])
            ->assertCreated()
            ->assertJsonPath('qc_status', 'drafted')
            ->json('id');

        $qualityId = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/quality-checks', [
                'production_batch_id' => $batchId,
                'clarity_test' => 'pass',
                'sprayer_test' => 'pass',
                'leak_test' => 'pass',
                'scent_test' => 'pass',
                'approval_status' => 'pending',
            ])
            ->assertCreated()
            ->assertJsonPath('approval_status', 'pending')
            ->json('id');

        $this->assertSame('qc_pending', ProductionBatch::findOrFail($batchId)->qc_status);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/batches/{$batchId}", [
                'qc_status' => 'approved',
                'notes' => 'Approved by readiness audit',
            ])
            ->assertOk();

        $variant->refresh();
        $this->assertSame(19, $variant->stock_quantity);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/admin/quality-checks/{$qualityId}", ['approval_status' => 'approved'])
            ->assertOk()
            ->assertJsonPath('approval_status', 'approved');

        $this->assertSame('approved', ProductionBatch::findOrFail($batchId)->qc_status);

        $variant->refresh();
        $this->assertSame(19, $variant->stock_quantity);
        $this->assertDatabaseHas((new Formula())->getTable(), ['id' => $formulaId]);
        $this->assertDatabaseHas((new Ingredient())->getTable(), ['id' => $ingredientId]);
        $this->assertDatabaseHas((new FormulaItem())->getTable(), ['id' => $formulaItemId]);
        $this->assertDatabaseHas((new QualityCheck())->getTable(), ['id' => $qualityId]);
    }

    public function test_online_payment_is_safely_disabled_without_provider_configuration(): void
    {
        Config::set('services.paymob.integration_id', null);
        $variant = $this->activeVariant('sharara');
        $orderCount = Order::count();

        $this->postJson('/api/checkout', $this->checkoutPayload($variant, 1, [
            'payment_method' => 'online_card',
        ]))
            ->assertStatus(422)
            ->assertJsonPath('error', 'Online payment is temporarily unavailable. Please choose cash on delivery.');

        $this->assertSame($orderCount, Order::count());
    }

    public function test_checkout_retries_order_number_generation_until_unique(): void
    {
        Order::create([
            'order_number' => 'ORD-DUPLICAT',
            'customer_name' => 'Existing Customer',
            'customer_phone' => '01000000000',
            'address' => 'Existing address',
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

        Str::createRandomStringsUsingSequence(['DUPLICAT', 'UNIQUE01']);

        try {
            $method = new \ReflectionMethod(CheckoutController::class, 'generateUniqueOrderNumber');
            $method->setAccessible(true);

            $this->assertSame('ORD-UNIQUE01', $method->invoke(new CheckoutController()));
        } finally {
            Str::createRandomStringsNormally();
        }
    }

    public function test_content_page_routes_work_for_required_public_pages(): void
    {
        foreach (['terms', 'privacy-policy', 'return-policy', 'faq', 'quality', 'about'] as $slug) {
            $this->getJson("/api/pages/{$slug}")
                ->assertOk()
                ->assertJsonPath('slug', $slug);
        }
    }

    public function test_checkout_rejects_expired_coupon(): void
    {
        $variant = $this->activeVariant('nada');

        Coupon::create([
            'code' => 'EXPIRED10',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'min_cart_total' => 0,
            'usage_limit' => 10,
            'used_count' => 0,
            'expiry_date' => now()->subDay(),
            'is_active' => true,
        ]);

        $this->postJson('/api/checkout', $this->checkoutPayload($variant, 1, [
            'coupon_code' => 'EXPIRED10',
        ]))->assertStatus(422);
    }
}
