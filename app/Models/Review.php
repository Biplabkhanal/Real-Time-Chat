<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = ['content', 'rating', 'published'];

    protected $appends = ['average_rating', 'total_reviews'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getAverageRatingAttribute()
    {
        return round(self::where('published', true)->avg('rating') ?? 0, 1);
    }

    public function getTotalReviewsAttribute()
    {
        return self::where('published', true)->count();
    }
}
