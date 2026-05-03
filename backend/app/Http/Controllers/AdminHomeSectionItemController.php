<?php

namespace App\Http\Controllers;

use App\Models\HomeSection;
use App\Models\HomeSectionItem;
use Illuminate\Http\Request;

class AdminHomeSectionItemController extends Controller
{
    public function store(Request $request, HomeSection $homeSection)
    {
        $item = $homeSection->items()->create($this->validated($request));

        return response()->json(['data' => $item->load('product:id,slug,name_ar,name_en,code,status,product_type')], 201);
    }

    public function update(Request $request, HomeSectionItem $homeSectionItem)
    {
        $homeSectionItem->update($this->validated($request));

        return response()->json(['data' => $homeSectionItem->fresh()->load('product:id,slug,name_ar,name_en,code,status,product_type')]);
    }

    public function destroy(HomeSectionItem $homeSectionItem)
    {
        $homeSectionItem->delete();

        return response()->noContent();
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'product_id' => ['nullable', 'exists:products,id'],
            'title_ar' => ['nullable', 'string', 'max:255'],
            'title_en' => ['nullable', 'string', 'max:255'],
            'subtitle_ar' => ['nullable', 'string'],
            'subtitle_en' => ['nullable', 'string'],
            'body_ar' => ['nullable', 'string'],
            'body_en' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'mobile_image_url' => ['nullable', 'string', 'max:500'],
            'link_url' => ['nullable', 'string', 'max:500'],
            'cta_label_ar' => ['nullable', 'string', 'max:255'],
            'cta_label_en' => ['nullable', 'string', 'max:255'],
            'accent_color' => ['nullable', 'string', 'max:50'],
            'settings' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
