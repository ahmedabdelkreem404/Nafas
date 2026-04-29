<?php

namespace App\Services\Notifications;

use App\Models\Order;
use App\Notifications\OrderConfirmedNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class OrderNotificationService
{
    public function sendOrderConfirmation(Order $order): void
    {
        if (!$order->customer_email) {
            Log::info('Order confirmation skipped because customer email is missing', ['order_number' => $order->order_number]);
            return;
        }

        Notification::route('mail', $order->customer_email)
            ->notify(new OrderConfirmedNotification($order));
    }

    public function notifyAdminNewOrder(Order $order): void
    {
        Log::info('Admin new order notification prepared', ['order_number' => $order->order_number]);
    }
}
