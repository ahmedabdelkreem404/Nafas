<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class AdminProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('variants', 'formula.items', 'media', 'tags')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:products',
            'name_ar' => 'required|string',
            'name_en' => 'required|string',
            'slug' => 'required|string|unique:products',
            'gender' => 'required|string',
            'status' => 'required|string',
            'story' => 'nullable|string',
            'personality' => 'nullable|string',
            'marketing_line_ar' => 'nullable|string',
            'scent_notes' => 'nullable|string',
            'season' => 'nullable|string',
            'time_of_day' => 'nullable|string',
            'projection_label' => 'nullable|string',
            'longevity_label' => 'nullable|string',
            'strength_label' => 'nullable|string',
            'cost_material_per_bottle' => 'nullable|numeric|min:0',
            'cost_packaging_per_bottle' => 'nullable|numeric|min:0',
            'cost_filling_per_bottle' => 'nullable|numeric|min:0',
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function show($id)
    {
        return response()->json(Product::with('variants', 'formula.items', 'media', 'tags')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'code' => 'string|unique:products,code,'.$id,
            'name_ar' => 'string',
            'name_en' => 'string',
            'slug' => 'string|unique:products,slug,'.$id,
            'gender' => 'string',
            'status' => 'string',
            'story' => 'nullable|string',
            'personality' => 'nullable|string',
            'marketing_line_ar' => 'nullable|string',
            'scent_notes' => 'nullable|string',
            'season' => 'nullable|string',
            'time_of_day' => 'nullable|string',
            'projection_label' => 'nullable|string',
            'longevity_label' => 'nullable|string',
            'strength_label' => 'nullable|string',
            'cost_material_per_bottle' => 'nullable|numeric|min:0',
            'cost_packaging_per_bottle' => 'nullable|numeric|min:0',
            'cost_filling_per_bottle' => 'nullable|numeric|min:0',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy($id)
    {
        Product::findOrFail($id)->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
