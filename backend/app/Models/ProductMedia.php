<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductMedia extends Model
{
    protected $fillable = [
        'product_id',
        'product_variant_id',
        'url',
        'type',
        'alt_text',
        'is_primary',
    ];
}
