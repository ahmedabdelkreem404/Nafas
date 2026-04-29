<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formula extends Model
{
    protected $fillable = [
        'product_id',
        'oil_percentage',
        'alcohol_percentage',
        'ifra_status',
        'sds_status',
        'supplier_name',
        'supplier_reference',
        'supplier_batch_reference',
        'is_admin_only',
        'internal_notes',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function items()
    {
        return $this->hasMany(FormulaItem::class);
    }
}
