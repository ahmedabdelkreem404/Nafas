<?php

namespace App\Http\Controllers;

use App\Models\Catalog;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminCatalogController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Catalog::with(['products:id,slug,name_ar,name_en,code,status,product_type'])
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $catalog = Catalog::create($this->validated($request));

        return response()->json(['data' => $catalog->load('products')], 201);
    }

    public function show(Catalog $catalog)
    {
        return response()->json(['data' => $catalog->load('products:id,slug,name_ar,name_en,code,status,product_type')]);
    }

    public function update(Request $request, Catalog $catalog)
    {
        $catalog->update($this->validated($request, $catalog->id));

        return response()->json(['data' => $catalog->fresh()->load('products:id,slug,name_ar,name_en,code,status,product_type')]);
    }

    public function destroy(Catalog $catalog)
    {
        $catalog->delete();

        return response()->noContent();
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['required', 'string', 'max:160', Rule::unique('catalogs', 'slug')->ignore($ignoreId)],
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'description_ar' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'banner_image_url' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
            'settings' => ['nullable', 'array'],
        ]);
    }
}
