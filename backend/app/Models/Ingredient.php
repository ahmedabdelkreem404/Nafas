<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = [
        'name',
        'unit',
        'supplier_name',
        'supplier_reference',
        'supplier_batch_reference',
        'ifra_status',
        'sds_status',
        'internal_notes',
        'is_active',
    ];
}
