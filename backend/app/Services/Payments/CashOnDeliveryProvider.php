<?php

namespace App\Services\Payments;

use App\Models\Order;

class CashOnDeliveryProvider implements PaymentProviderInterface
{
    public function createPayment(Order $order): array
    {
        return [
            'provider' => 'cash_on_delivery',
            'status' => 'pending',
            'reference' => 'COD-' . $order->order_number,
            'payload' => ['instruction' => 'Collect cash on delivery'],
        ];
    }
}
