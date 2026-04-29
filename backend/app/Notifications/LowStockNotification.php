<?php

namespace App\Notifications;

use App\Models\ProductVariant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected ProductVariant $variant
    ) {
        $this->onQueue('notifications');
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $productName = $this->variant->product?->name_ar ?: $this->variant->product?->name_en ?: $this->variant->sku;

        return (new MailMessage())
            ->subject("تحذير مخزون منخفض — {$productName}")
            ->greeting('تنبيه تشغيل')
            ->line("المتغير {$this->variant->sku} وصل إلى مستوى مخزون منخفض.")
            ->line("المنتج: {$productName}")
            ->line("الكمية الحالية: {$this->variant->stock_quantity}")
            ->line("حد التنبيه: {$this->variant->low_stock_threshold}");
    }
}
