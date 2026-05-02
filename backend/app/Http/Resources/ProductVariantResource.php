<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'size_ml' => $this->size_ml,
            'label' => $this->label,
            'retail_price' => $this->retail_price,
            'in_stock' => $this->stock_quantity > 0,
            'stock_quantity' => $this->stock_quantity,
            'is_active' => (bool) $this->is_active,
            'is_tester' => (bool) $this->is_tester,
            'is_ball_oil_only' => (bool) $this->is_ball_oil_only,
            'type' => $this->is_tester ? 'tester' : 'retail',
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}
