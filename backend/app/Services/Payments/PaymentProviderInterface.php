<?php

namespace App\Services\Payments;

use App\Models\Order;

interface PaymentProviderInterface
{
    public function createPayment(Order $order): array;
}
