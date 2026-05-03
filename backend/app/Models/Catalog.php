<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Catalog extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name_ar',
        'name_en',
        'description_ar',
        'description_en',
        'image_url',
        'banner_image_url',
        'sort_order',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class)
            ->using(CatalogProduct::class)
            ->withPivot(['id', 'sort_order', 'is_featured'])
            ->withTimestamps()
            ->orderBy('catalog_product.sort_order');
    }
}
