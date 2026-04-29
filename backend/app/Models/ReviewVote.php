<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewVote extends Model
{
    protected $fillable = [
        'review_id',
        'session_key',
        'type',
    ];

    public function review()
    {
        return $this->belongsTo(Review::class);
    }
}
