<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'size_ml',
        'label',
        'bottle_type',
        'packaging_type',
        'cost_price',
        'wholesale_price',
        'retail_price',
        'stock_quantity',
        'low_stock_threshold',
        'is_active',
        'is_tester',
        'is_ball_oil_only',
        'oil_percentage',
        'alcohol_percentage',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
