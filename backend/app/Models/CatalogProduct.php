<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CatalogProduct extends Pivot
{
    protected $table = 'catalog_product';

    public $incrementing = true;

    protected $fillable = [
        'catalog_id',
        'product_id',
        'sort_order',
        'is_featured',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_featured' => 'boolean',
    ];

    public function catalog()
    {
        return $this->belongsTo(Catalog::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
