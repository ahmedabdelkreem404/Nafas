<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\HomeSection;

class PublicHomeController extends Controller
{
    public function __invoke()
    {
        $sections = HomeSection::query()
            ->where('is_active', true)
            ->with(['items' => function ($query) {
                $query
                    ->where('is_active', true)
                    ->with(['product' => function ($productQuery) {
                        $productQuery
                            ->where('status', 'active')
                            ->with([
                                'variants' => fn ($builder) => $builder->where('is_active', true),
                                'media',
                                'catalogs' => fn ($builder) => $builder->where('catalogs.is_active', true),
                            ]);
                    }])
                    ->orderBy('sort_order');
            }])
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'sections' => $sections->map(fn (HomeSection $section) => [
                'id' => $section->id,
                'section_key' => $section->section_key,
                'type' => $section->type,
                'title_ar' => $section->title_ar,
                'title_en' => $section->title_en,
                'subtitle_ar' => $section->subtitle_ar,
                'subtitle_en' => $section->subtitle_en,
                'body_ar' => $section->body_ar,
                'body_en' => $section->body_en,
                'eyebrow_ar' => $section->eyebrow_ar,
                'eyebrow_en' => $section->eyebrow_en,
                'cta_label_ar' => $section->cta_label_ar,
                'cta_label_en' => $section->cta_label_en,
                'cta_url' => $section->cta_url,
                'secondary_cta_label_ar' => $section->secondary_cta_label_ar,
                'secondary_cta_label_en' => $section->secondary_cta_label_en,
                'secondary_cta_url' => $section->secondary_cta_url,
                'image_url' => $section->image_url,
                'mobile_image_url' => $section->mobile_image_url,
                'video_url' => $section->video_url,
                'accent_color' => $section->accent_color,
                'background_color' => $section->background_color,
                'settings' => $section->settings ?? [],
                'sort_order' => $section->sort_order,
                'items' => $section->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'title_ar' => $item->title_ar,
                    'title_en' => $item->title_en,
                    'subtitle_ar' => $item->subtitle_ar,
                    'subtitle_en' => $item->subtitle_en,
                    'body_ar' => $item->body_ar,
                    'body_en' => $item->body_en,
                    'image_url' => $item->image_url,
                    'mobile_image_url' => $item->mobile_image_url,
                    'link_url' => $item->link_url,
                    'cta_label_ar' => $item->cta_label_ar,
                    'cta_label_en' => $item->cta_label_en,
                    'accent_color' => $item->accent_color,
                    'settings' => $item->settings ?? [],
                    'sort_order' => $item->sort_order,
                    'product' => $item->product ? new ProductResource($item->product) : null,
                ]),
            ]),
        ]);
    }
}
