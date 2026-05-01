<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'provider',
        'method',
        'status',
        'amount',
        'currency',
        'reference',
        'payer_phone',
        'proof_image_path',
        'review_status',
        'reviewed_at',
        'reviewed_by',
        'admin_note',
        'provider_payload',
    ];

    protected $casts = [
        'provider_payload' => 'array',
        'reviewed_at' => 'datetime',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
