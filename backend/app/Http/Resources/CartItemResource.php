<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $variant = $this->whenLoaded('variant');
        $product = $variant?->relationLoaded('product') ? $variant->product : null;

        return [
            'id' => $this->id,
            'quantity' => (int) $this->quantity,
            'snapshot_price' => $this->snapshot_price,
            'variant' => $variant ? [
                'id' => $variant->id,
                'sku' => $variant->sku,
                'size_ml' => $variant->size_ml,
                'label' => $variant->label,
                'retail_price' => $variant->retail_price,
                'in_stock' => $variant->stock_quantity > 0,
                'product' => $product ? [
                    'id' => $product->id,
                    'code' => $product->code,
                    'slug' => $product->slug,
                    'name_ar' => $product->name_ar,
                    'name_en' => $product->name_en,
                    'gender' => $product->gender,
                    'marketing_line_ar' => $product->marketing_line_ar,
                    'marketing_line_en' => $product->marketing_line_en,
                ] : null,
            ] : null,
        ];
    }
}
