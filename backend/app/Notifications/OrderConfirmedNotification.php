<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderConfirmedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Order $order
    ) {
        $this->onQueue('notifications');
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $locale = $this->resolveLocale();
        $subject = $locale === 'en'
            ? "Your order #{$this->order->order_number} is confirmed — Nafas"
            : "تم استلام طلبك #{$this->order->order_number} — نفَس";

        return (new MailMessage())
            ->subject($subject)
            ->view('emails.order-confirmed', [
                'deliveryText' => $locale === 'en' ? 'Within 2-5 business days' : 'خلال 2-5 أيام عمل',
                'locale' => $locale,
                'order' => $this->order->loadMissing('items.variant.product'),
                'shopUrl' => config('app.frontend_url', 'http://localhost:5173/shop'),
                'supportUrl' => 'https://wa.me/201000000000',
            ]);
    }

    protected function resolveLocale(): string
    {
        if (preg_match('/[A-Za-z]/', (string) $this->order->customer_name)) {
            return 'en';
        }

        return 'ar';
    }
}
