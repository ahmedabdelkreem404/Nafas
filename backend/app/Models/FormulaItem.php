<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormulaItem extends Model
{
    protected $fillable = [
        'formula_id',
        'ingredient_id',
        'ingredient_name',
        'quantity_ml',
        'quantity_grams',
        'cost_per_gram',
        'percentage',
        'internal_notes',
        'supplier_reference',
        'ifra_status',
        'sds_status',
    ];

    public function formula()
    {
        return $this->belongsTo(Formula::class);
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }
}
