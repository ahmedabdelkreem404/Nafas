<?php

namespace App\Services\Payments;

use App\Models\Order;

class PaymobProvider implements PaymentProviderInterface
{
    public function createPayment(Order $order): array
    {
        return [
            'provider' => 'paymob',
            'status' => 'pending',
            'reference' => env('PAYMOB_INTEGRATION_ID') ? 'PAYMOB-' . $order->order_number : null,
            'payload' => [
                'base_url' => env('PAYMOB_BASE_URL'),
                'integration_id' => env('PAYMOB_INTEGRATION_ID'),
            ],
        ];
    }
}
