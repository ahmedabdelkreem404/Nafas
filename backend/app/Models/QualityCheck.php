<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QualityCheck extends Model
{
    protected $fillable = [
        'production_batch_id',
        'clarity_test',
        'sprayer_test',
        'leak_test',
        'scent_test',
        'projection_notes',
        'longevity_notes',
        'approval_status',
        'notes',
    ];

    public function batch()
    {
        return $this->belongsTo(ProductionBatch::class, 'production_batch_id');
    }
}
