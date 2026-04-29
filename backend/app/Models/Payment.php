<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'provider',
        'status',
        'amount',
        'currency',
        'reference',
        'provider_payload',
    ];

    protected $casts = [
        'provider_payload' => 'array',
    ];
}
