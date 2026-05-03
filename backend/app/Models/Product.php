<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'slug',
        'name_ar',
        'name_en',
        'gender',
        'story',
        'category_id',
        'personality',
        'marketing_line_ar',
        'marketing_line_en',
        'design_direction',
        'scent_notes',
        'season',
        'time_of_day',
        'projection_label',
        'longevity_label',
        'strength_label',
        'seo_title',
        'seo_description',
        'og_image_url',
        'cost_material_per_bottle',
        'cost_packaging_per_bottle',
        'cost_filling_per_bottle',
        'status',
        'product_type',
        'public_label_ar',
        'public_label_en',
        'internal_reference',
        'internal_notes',
        'hero_image_url',
        'card_image_url',
        'mobile_image_url',
        'scent_family',
        'tags',
        'is_featured',
        'show_on_home',
        'show_in_shop',
        'home_image_url',
        'home_mobile_image_url',
        'home_link_url',
        'home_sort_order',
        'shop_sort_order',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
        'show_on_home' => 'boolean',
        'show_in_shop' => 'boolean',
        'home_sort_order' => 'integer',
        'shop_sort_order' => 'integer',
    ];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
    
    public function formula()
    {
        return $this->hasOne(Formula::class);
    }

    public function media()
    {
        return $this->hasMany(ProductMedia::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function catalogs()
    {
        return $this->belongsToMany(Catalog::class)
            ->using(CatalogProduct::class)
            ->withPivot(['id', 'sort_order', 'is_featured'])
            ->withTimestamps();
    }
}
