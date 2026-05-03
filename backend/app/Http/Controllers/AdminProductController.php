<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class AdminProductController extends Controller
{
    public function index()
    {
        $query = Product::with('variants', 'formula.items', 'media', 'catalogs');

        if ($search = request('search')) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name_ar', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($status = request('status')) {
            $query->where('status', $status);
        }

        if ($type = request('product_type')) {
            $query->where('product_type', $type);
        }

        if ($catalog = request('catalog')) {
            $query->whereHas('catalogs', fn ($builder) => $builder->where('catalogs.slug', $catalog));
        }

        if (request()->has('is_featured')) {
            $query->where('is_featured', filter_var(request('is_featured'), FILTER_VALIDATE_BOOLEAN));
        }

        return response()->json($query->get());
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
            'marketing_line_en' => 'nullable|string',
            'design_direction' => 'nullable|string',
            'scent_notes' => 'nullable|string',
            'season' => 'nullable|string',
            'time_of_day' => 'nullable|string',
            'projection_label' => 'nullable|string',
            'longevity_label' => 'nullable|string',
            'strength_label' => 'nullable|string',
            'cost_material_per_bottle' => 'nullable|numeric|min:0',
            'cost_packaging_per_bottle' => 'nullable|numeric|min:0',
            'cost_filling_per_bottle' => 'nullable|numeric|min:0',
            'product_type' => 'nullable|string',
            'public_label_ar' => 'nullable|string',
            'public_label_en' => 'nullable|string',
            'internal_reference' => 'nullable|string',
            'internal_notes' => 'nullable|string',
            'hero_image_url' => 'nullable|string',
            'card_image_url' => 'nullable|string',
            'mobile_image_url' => 'nullable|string',
            'scent_family' => 'nullable|string',
            'tags' => 'nullable|array',
            'is_featured' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
            'show_in_shop' => 'nullable|boolean',
            'home_image_url' => 'nullable|string',
            'home_mobile_image_url' => 'nullable|string',
            'home_link_url' => 'nullable|string',
            'home_sort_order' => 'nullable|integer',
            'shop_sort_order' => 'nullable|integer',
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function show($id)
    {
        return response()->json(Product::with('variants', 'formula.items', 'media', 'catalogs')->findOrFail($id));
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
            'marketing_line_en' => 'nullable|string',
            'design_direction' => 'nullable|string',
            'scent_notes' => 'nullable|string',
            'season' => 'nullable|string',
            'time_of_day' => 'nullable|string',
            'projection_label' => 'nullable|string',
            'longevity_label' => 'nullable|string',
            'strength_label' => 'nullable|string',
            'cost_material_per_bottle' => 'nullable|numeric|min:0',
            'cost_packaging_per_bottle' => 'nullable|numeric|min:0',
            'cost_filling_per_bottle' => 'nullable|numeric|min:0',
            'product_type' => 'nullable|string',
            'public_label_ar' => 'nullable|string',
            'public_label_en' => 'nullable|string',
            'internal_reference' => 'nullable|string',
            'internal_notes' => 'nullable|string',
            'hero_image_url' => 'nullable|string',
            'card_image_url' => 'nullable|string',
            'mobile_image_url' => 'nullable|string',
            'scent_family' => 'nullable|string',
            'tags' => 'nullable|array',
            'is_featured' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
            'show_in_shop' => 'nullable|boolean',
            'home_image_url' => 'nullable|string',
            'home_mobile_image_url' => 'nullable|string',
            'home_link_url' => 'nullable|string',
            'home_sort_order' => 'nullable|integer',
            'shop_sort_order' => 'nullable|integer',
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
