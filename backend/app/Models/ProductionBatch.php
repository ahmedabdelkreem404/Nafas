<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductionBatch extends Model
{
    protected $fillable = [
        'batch_code',
        'product_id',
        'product_variant_id',
        'quantity_produced',
        'mix_date',
        'maturation_start_date',
        'allowed_sale_date',
        'qc_status',
        'notes',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function qualityChecks()
    {
        return $this->hasMany(QualityCheck::class, 'production_batch_id');
    }
}
