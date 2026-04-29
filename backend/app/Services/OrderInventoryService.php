<?php

namespace App\Services;

use App\Models\InventoryMovement;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\Setting;
use App\Notifications\LowStockNotification;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;

class OrderInventoryService
{
    public function deduct(Order $order, string $reason = 'order_confirmed'): void
    {
        if ($order->stock_deducted) {
            return;
        }

        $order->loadMissing('items.variant');

        foreach ($order->items as $item) {
            $variant = $item->variant;
            $variant->decrement('stock_quantity', $item->quantity);
            $variant->refresh();

            InventoryMovement::create([
                'product_variant_id' => $variant->id,
                'type' => 'deduction',
                'quantity' => $item->quantity,
                'reason' => $reason,
                'order_id' => $order->id,
            ]);

            $this->notifyLowStockIfNeeded($variant);
        }

        $order->forceFill(['stock_deducted' => true])->save();
    }

    public function restore(Order $order, string $reason = 'order_cancelled_restored'): void
    {
        if (!$order->stock_deducted) {
            return;
        }

        $order->loadMissing('items.variant');

        foreach ($order->items as $item) {
            $variant = $item->variant;
            $variant->increment('stock_quantity', $item->quantity);

            InventoryMovement::create([
                'product_variant_id' => $variant->id,
                'type' => 'addition',
                'quantity' => $item->quantity,
                'reason' => $reason,
                'order_id' => $order->id,
            ]);
        }

        $order->forceFill(['stock_deducted' => false])->save();
    }

    protected function notifyLowStockIfNeeded(ProductVariant $variant): void
    {
        $threshold = (int) ($variant->low_stock_threshold ?: 5);
        if ($variant->stock_quantity > $threshold) {
            return;
        }

        $cacheKey = "low_stock_notified_{$variant->id}";
        if (Cache::has($cacheKey)) {
            return;
        }

        $adminEmail = Setting::where('key', 'admin_email')->value('value') ?: env('ADMIN_EMAIL');
        if (!$adminEmail) {
            return;
        }

        $variant->loadMissing('product');

        Notification::route('mail', $adminEmail)
            ->notify(new LowStockNotification($variant));

        Cache::put($cacheKey, true, now()->addDay());
    }
}
