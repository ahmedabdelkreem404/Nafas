<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class AdminProductVariantController extends Controller
{
    public function index(Product $product)
    {
        return response()->json($product->variants);
    }

    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sku' => 'required|string|unique:product_variants',
            'size_ml' => 'required|integer',
            'label' => 'nullable|string',
            'bottle_type' => 'nullable|string',
            'packaging_type' => 'nullable|string',
            'cost_price' => 'required|numeric',
            'wholesale_price' => 'nullable|numeric',
            'retail_price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'low_stock_threshold' => 'nullable|numeric',
            'is_active' => 'nullable|boolean',
            'is_tester' => 'nullable|boolean',
            'is_ball_oil_only' => 'nullable|boolean',
            'oil_percentage' => 'nullable|numeric',
            'alcohol_percentage' => 'nullable|numeric',
        ]);

        $variant = $product->variants()->create($validated);
        
        // Log initial stock as movement
        \App\Models\InventoryMovement::create([
            'product_variant_id' => $variant->id,
            'type' => 'addition',
            'quantity' => $validated['stock_quantity'],
            'reason' => 'initial_creation'
        ]);

        return response()->json($variant, 201);
    }

    public function show(ProductVariant $variant)
    {
        return response()->json($variant->load('product'));
    }

    public function update(Request $request, ProductVariant $variant)
    {
        $validated = $request->validate([
            'sku' => 'string|unique:product_variants,sku,'.$variant->id,
            'size_ml' => 'integer',
            'label' => 'nullable|string',
            'cost_price' => 'numeric',
            'wholesale_price' => 'nullable|numeric',
            'retail_price' => 'numeric',
            'stock_quantity' => 'integer',
            'low_stock_threshold' => 'nullable|numeric',
            'is_active' => 'boolean',
            'is_tester' => 'boolean',
            'is_ball_oil_only' => 'boolean',
            'oil_percentage' => 'nullable|numeric',
            'alcohol_percentage' => 'nullable|numeric',
        ]);

        $variant->update($validated);
        return response()->json($variant);
    }

    public function destroy(ProductVariant $variant)
    {
        $variant->delete();
        return response()->json(['message' => 'Variant deleted']);
    }
}
