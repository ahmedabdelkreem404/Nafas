<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $fillable = [
        'page_id',
        'title',
        'section_key',
        'content',
        'sort_order',
        'is_active',
    ];
}
