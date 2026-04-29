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
}
