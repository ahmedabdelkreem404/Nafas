<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_key',
        'type',
        'title_ar',
        'title_en',
        'subtitle_ar',
        'subtitle_en',
        'body_ar',
        'body_en',
        'eyebrow_ar',
        'eyebrow_en',
        'cta_label_ar',
        'cta_label_en',
        'cta_url',
        'secondary_cta_label_ar',
        'secondary_cta_label_en',
        'secondary_cta_url',
        'image_url',
        'mobile_image_url',
        'video_url',
        'accent_color',
        'background_color',
        'settings',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(HomeSectionItem::class)->orderBy('sort_order');
    }
}
