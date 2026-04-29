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
            'rating_average' => round((float) ($this->rating_average ?? 0), 2),
            'review_count' => (int) ($this->reviews_count ?? 0),
            'reviews_count' => (int) ($this->reviews_count ?? 0),
            'media' => $this->whenLoaded('media'),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
        ];
    }
}
