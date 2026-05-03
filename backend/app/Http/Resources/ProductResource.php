<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'slug' => $this->slug,
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
            'gender' => $this->gender,
            'product_type' => $this->product_type ?? 'nafas_signature',
            'public_label_ar' => $this->public_label_ar,
            'public_label_en' => $this->public_label_en,
            'scent_family' => $this->scent_family,
            'tags' => $this->tags ?? [],
            'story' => $this->story,
            'personality' => $this->personality,
            'marketing_line_ar' => $this->marketing_line_ar,
            'marketing_line_en' => $this->marketing_line_en,
            'design_direction' => $this->design_direction,
            'scent_notes' => $this->scent_notes,
            'season' => $this->season,
            'time_of_day' => $this->time_of_day,
            'projection_label' => $this->projection_label,
            'longevity_label' => $this->longevity_label,
            'strength_label' => $this->strength_label,
            'hero_image_url' => $this->hero_image_url,
            'card_image_url' => $this->card_image_url,
            'mobile_image_url' => $this->mobile_image_url,
            'home_image_url' => $this->home_image_url,
            'home_mobile_image_url' => $this->home_mobile_image_url,
            'home_link_url' => $this->home_link_url ?: ($this->slug ? "/products/{$this->slug}" : null),
            'home_sort_order' => (int) ($this->home_sort_order ?? 0),
            'shop_sort_order' => (int) ($this->shop_sort_order ?? 0),
            'is_featured' => (bool) ($this->is_featured ?? false),
            'show_on_home' => (bool) ($this->show_on_home ?? false),
            'show_in_shop' => (bool) ($this->show_in_shop ?? true),
            'rating_average' => round((float) ($this->rating_average ?? 0), 2),
            'review_count' => (int) ($this->reviews_count ?? 0),
            'reviews_count' => (int) ($this->reviews_count ?? 0),
            'media' => $this->whenLoaded('media'),
            'catalogs' => $this->whenLoaded('catalogs', fn () => $this->catalogs->map(fn ($catalog) => [
                'id' => $catalog->id,
                'slug' => $catalog->slug,
                'name_ar' => $catalog->name_ar,
                'name_en' => $catalog->name_en,
                'sort_order' => (int) ($catalog->pivot->sort_order ?? 0),
                'is_featured' => (bool) ($catalog->pivot->is_featured ?? false),
            ])),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
        ];
    }
}
