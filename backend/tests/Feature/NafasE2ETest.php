<?php

namespace Tests\Feature;

use App\Models\ContactInquiry;
use App\Models\Customer;
use App\Models\Formula;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\User;
use App\Models\WholesaleInquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
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
        $variant = ProductVariant::first();

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
        $variant = ProductVariant::first();

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
        $variant = ProductVariant::first();
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
        $variant = ProductVariant::first();
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
        $variant = ProductVariant::first();
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
        $variant = ProductVariant::first();
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

    public function test_cart_validation_blocks_out_of_stock_and_stale_price(): void
    {
        $variant = ProductVariant::first();
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
