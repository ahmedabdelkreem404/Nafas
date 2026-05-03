<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Catalog;

class PublicCatalogController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Catalog::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function show(string $slug)
    {
        $catalog = Catalog::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json(['data' => $catalog]);
    }

    public function products(string $slug)
    {
        $catalog = Catalog::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->firstOrFail();

        $products = $catalog->products()
            ->where('status', 'active')
            ->with([
                'variants' => fn ($builder) => $builder->where('is_active', true),
                'media',
                'catalogs' => fn ($builder) => $builder->where('catalogs.is_active', true),
            ])
            ->get();

        return ProductResource::collection($products)->additional([
            'catalog' => $catalog,
        ]);
    }
}
