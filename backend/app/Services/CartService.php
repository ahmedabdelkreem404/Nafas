<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\User;

class CartService
{
    public function resolveCart(?User $user, ?string $sessionKey = null): Cart
    {
        if ($user) {
            return Cart::firstOrCreate(['user_id' => $user->id]);
        }

        return Cart::firstOrCreate(['session_key' => $sessionKey ?: uniqid('guest_', true)]);
    }

    public function mergeGuestCart(User $user, array $items): Cart
    {
        $cart = $this->resolveCart($user);

        foreach ($items as $item) {
            $variant = ProductVariant::with('product')->find($item['variant_id'] ?? null);
            if (!$variant || !$variant->is_active || !$variant->product || $variant->product->status !== 'active') {
                continue;
            }

            CartItem::updateOrCreate(
                ['cart_id' => $cart->id, 'product_variant_id' => $variant->id],
                [
                    'quantity' => $item['quantity'],
                    'snapshot_price' => $variant->retail_price,
                ]
            );
        }

        return $cart->fresh('items.variant.product');
    }
}
