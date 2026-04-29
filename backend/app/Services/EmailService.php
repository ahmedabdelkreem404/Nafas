<?php

namespace App\Services;

class EmailService
{
    public function sendOrderConfirmation($order)
    {
        \Illuminate\Support\Facades\Log::info("Sending Order Confirmation email for Order #{$order->order_number} to {$order->customer_email}");
    }

    public function notifyAdminNewOrder($order)
    {
        \Illuminate\Support\Facades\Log::info("Notifying admin of new Order #{$order->order_number}");
    }
}
