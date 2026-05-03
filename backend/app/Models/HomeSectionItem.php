<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeSectionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'home_section_id',
        'product_id',
        'title_ar',
        'title_en',
        'subtitle_ar',
        'subtitle_en',
        'body_ar',
        'body_en',
        'image_url',
        'mobile_image_url',
        'link_url',
        'cta_label_ar',
        'cta_label_en',
        'accent_color',
        'settings',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function section()
    {
        return $this->belongsTo(HomeSection::class, 'home_section_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
