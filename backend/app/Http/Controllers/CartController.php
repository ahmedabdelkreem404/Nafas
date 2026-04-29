<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request, CartService $cartService)
    {
        $cart = $cartService->resolveCart($request->user(), $request->header('X-Session-Key'));
        return response()->json($cart->load('items.variant.product'));
    }

    public function add(Request $request, CartService $cartService)
    {
        $validated = $request->validate([
            'variant_id' => ['required', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $cartService->resolveCart($request->user(), $request->header('X-Session-Key'));
        $variant = ProductVariant::with('product')->findOrFail($validated['variant_id']);

        if (!$variant->is_active || !$variant->product || $variant->product->status !== 'active') {
            return response()->json(['message' => 'Variant unavailable'], 422);
        }

        if ($variant->stock_quantity < $validated['quantity']) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }

        CartItem::updateOrCreate(
            ['cart_id' => $cart->id, 'product_variant_id' => $variant->id],
            ['quantity' => $validated['quantity'], 'snapshot_price' => $variant->retail_price]
        );

        return response()->json($cart->fresh('items.variant.product'), 201);
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $variant = $cartItem->variant()->with('product')->firstOrFail();
        if (!$variant->is_active || !$variant->product || $variant->product->status !== 'active') {
            return response()->json(['message' => 'Variant unavailable'], 422);
        }
        if ($variant->stock_quantity < $validated['quantity']) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }

        $cartItem->update([
            'quantity' => $validated['quantity'],
            'snapshot_price' => $variant->retail_price,
        ]);

        return response()->json($cartItem->load('variant.product'));
    }

    public function destroy(CartItem $cartItem)
    {
        $cartItem->delete();
        return response()->json(['message' => 'Cart item removed']);
    }

    public function clear(Request $request, CartService $cartService)
    {
        $cart = $cartService->resolveCart($request->user(), $request->header('X-Session-Key'));
        $cart->items()->delete();
        return response()->json(['message' => 'Cart cleared']);
    }

    public function merge(Request $request, CartService $cartService)
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.variant_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        return response()->json($cartService->mergeGuestCart($request->user(), $validated['items']));
    }
}
