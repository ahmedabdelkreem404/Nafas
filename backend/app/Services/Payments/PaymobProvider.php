<?php

namespace App\Services\Payments;

use App\Models\Order;

class PaymobProvider implements PaymentProviderInterface
{
    public function createPayment(Order $order): array
    {
        $integrationId = config('services.paymob.integration_id');

        return [
            'provider' => 'paymob',
            'status' => 'pending',
            'reference' => $integrationId ? 'PAYMOB-' . $order->order_number : null,
            'payload' => [
                'base_url' => config('services.paymob.base_url'),
                'integration_id' => $integrationId,
            ],
        ];
    }
}
