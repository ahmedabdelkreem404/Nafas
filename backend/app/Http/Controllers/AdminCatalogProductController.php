<?php

namespace App\Http\Controllers;

use App\Models\Catalog;
use App\Models\CatalogProduct;
use Illuminate\Http\Request;

class AdminCatalogProductController extends Controller
{
    public function store(Request $request, Catalog $catalog)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'sort_order' => ['nullable', 'integer'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $catalog->products()->syncWithoutDetaching([
            $validated['product_id'] => [
                'sort_order' => $validated['sort_order'] ?? 0,
                'is_featured' => $validated['is_featured'] ?? false,
            ],
        ]);

        $pivot = CatalogProduct::query()
            ->where('catalog_id', $catalog->id)
            ->where('product_id', $validated['product_id'])
            ->firstOrFail();

        return response()->json(['data' => $pivot->load('product:id,slug,name_ar,name_en,code,status,product_type')], 201);
    }

    public function update(Request $request, CatalogProduct $catalogProduct)
    {
        $catalogProduct->update($request->validate([
            'sort_order' => ['nullable', 'integer'],
            'is_featured' => ['nullable', 'boolean'],
        ]));

        return response()->json(['data' => $catalogProduct->fresh()->load('product:id,slug,name_ar,name_en,code,status,product_type')]);
    }

    public function destroy(CatalogProduct $catalogProduct)
    {
        $catalogProduct->delete();

        return response()->noContent();
    }
}
