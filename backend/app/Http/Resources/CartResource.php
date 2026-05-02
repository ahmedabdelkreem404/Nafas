<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items', fn () => $this->items
            ->filter(fn ($item) => $item->variant
                && $item->variant->is_active
                && $item->variant->product
                && $item->variant->product->status === 'active')
            ->values());

        return [
            'id' => $this->id,
            'items' => CartItemResource::collection($items),
        ];
    }
}
