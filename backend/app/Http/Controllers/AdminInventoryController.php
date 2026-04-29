<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class AdminInventoryController extends Controller
{
    public function lowStock()
    {
        return response()->json(
            ProductVariant::with('product')
                ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
                ->get()
        );
    }

    public function movements()
    {
        return response()->json(InventoryMovement::with('variant.product')->latest()->get());
    }

    public function adjustments(Request $request)
    {
        $validated = $request->validate([
            'product_variant_id' => ['required', 'exists:product_variants,id'],
            'type' => ['required', 'in:addition,deduction'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'max:255'],
        ]);

        $variant = ProductVariant::findOrFail($validated['product_variant_id']);

        if ($validated['type'] === 'deduction' && $variant->stock_quantity < $validated['quantity']) {
            return response()->json(['message' => 'Insufficient stock for adjustment'], 422);
        }

        if ($validated['type'] === 'addition') {
            $variant->increment('stock_quantity', $validated['quantity']);
        } else {
            $variant->decrement('stock_quantity', $validated['quantity']);
        }

        $movement = InventoryMovement::create($validated);

        return response()->json([
            'movement' => $movement->load('variant.product'),
            'variant' => $variant->fresh(),
        ], 201);
    }
}
