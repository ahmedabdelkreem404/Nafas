<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductMedia;
use Illuminate\Http\Request;

class AdminProductMediaController extends Controller
{
    public function index(Product $product)
    {
        return response()->json($product->media);
    }

    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'url' => 'required|url',
            'type' => 'required|string',
            'alt_text' => 'nullable|string',
            'is_primary' => 'boolean',
        ]);

        if ($validated['is_primary'] ?? false) {
            $product->media()->update(['is_primary' => false]);
        }

        $media = $product->media()->create($validated);
        return response()->json($media, 201);
    }

    public function show(ProductMedia $medium)
    {
        return response()->json($medium);
    }

    public function update(Request $request, ProductMedia $medium)
    {
        $validated = $request->validate([
            'url' => 'sometimes|url',
            'type' => 'sometimes|string',
            'alt_text' => 'nullable|string',
            'is_primary' => 'nullable|boolean',
        ]);

        if (($validated['is_primary'] ?? false) && $medium->product_id) {
            Product::find($medium->product_id)?->media()->update(['is_primary' => false]);
        }

        $medium->update($validated);
        return response()->json($medium);
    }

    public function destroy(ProductMedia $medium)
    {
        $medium->delete();
        return response()->json(['message' => 'Media deleted']);
    }
}
