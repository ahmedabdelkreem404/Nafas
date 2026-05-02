<?php

namespace App\Http\Resources;

use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'customer_name' => $this->customer_name,
            'customer_phone' => $this->customer_phone,
            'customer_email' => $this->customer_email,
            'address' => $this->address,
            'city' => $this->city,
            'governorate' => $this->governorate,
            'subtotal_amount' => $this->subtotal_amount,
            'discount_amount' => $this->discount_amount,
            'shipping_amount' => $this->shipping_amount,
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'coupon_code' => $this->coupon_code,
            'delivery_notes' => $this->delivery_notes,
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn (OrderItem $item) => $this->safeItem($item))->values()),
            'history' => $this->whenLoaded('history', fn () => $this->history->map(fn ($history) => [
                'id' => $history->id,
                'from_status' => $history->from_status,
                'to_status' => $history->to_status,
                'created_at' => $history->created_at,
            ])->values()),
            'payment' => $this->whenLoaded('payment', fn () => $this->safePayment($this->payment)),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function safeItem(OrderItem $item): array
    {
        $variant = $item->variant;
        $product = $variant?->product;
        $isPublicProduct = $product instanceof Product && $product->status === 'active';

        return [
            'id' => $item->id,
            'quantity' => $item->quantity,
            'unit_price' => $item->unit_price,
            'total_price' => round((float) $item->unit_price * (int) $item->quantity, 2),
            'variant' => $isPublicProduct && $variant instanceof ProductVariant ? $this->safeVariant($variant) : null,
            'product' => $isPublicProduct ? $this->safeProduct($product) : null,
        ];
    }

    private function safeVariant(ProductVariant $variant): array
    {
        return [
            'id' => $variant->id,
            'sku' => $variant->sku,
            'size_ml' => $variant->size_ml,
            'label' => $variant->label,
            'retail_price' => $variant->retail_price,
        ];
    }

    private function safeProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'code' => $product->code,
            'slug' => $product->slug,
            'name_ar' => $product->name_ar,
            'name_en' => $product->name_en,
            'gender' => $product->gender,
            'marketing_line_ar' => $product->marketing_line_ar,
            'marketing_line_en' => $product->marketing_line_en,
        ];
    }

    private function safePayment(?Payment $payment): ?array
    {
        if (!$payment) {
            return null;
        }

        return [
            'id' => $payment->id,
            'method' => $payment->method,
            'provider' => $payment->provider,
            'status' => $payment->status,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'reference' => $payment->reference,
            'payer_phone' => $payment->payer_phone,
            'review_status' => $payment->review_status,
            'proof_uploaded' => (bool) $payment->proof_image_path,
            'reviewed_at' => $payment->reviewed_at,
        ];
    }
}
