<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'order_number' => 'ORD-' . strtoupper(fake()->bothify('########')),
            'customer_id' => User::factory(),
            'customer_name' => fake()->name(),
            'customer_phone' => '01' . fake()->numerify('#########'),
            'customer_email' => fake()->safeEmail(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'governorate' => fake()->state(),
            'subtotal_amount' => 100,
            'discount_amount' => 0,
            'shipping_amount' => 0,
            'total_amount' => 100,
            'status' => 'pending',
            'payment_method' => 'cash_on_delivery',
            'stock_deducted' => false,
        ];
    }
}
