<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FriendRequest extends Model
{
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'status'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who sent the friend request
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the user who received the friend request
     */
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /**
     * Accept the friend request
     */
    public function accept()
    {
        $this->update(['status' => 'accepted']);

        // Create friendship relationships (bidirectional)
        Friendship::create([
            'user_id' => $this->sender_id,
            'friend_id' => $this->receiver_id,
        ]);

        Friendship::create([
            'user_id' => $this->receiver_id,
            'friend_id' => $this->sender_id,
        ]);
    }

    /**
     * Decline the friend request
     */
    public function decline()
    {
        $this->update(['status' => 'declined']);
    }

    /**
     * Check if request is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if request is accepted
     */
    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    /**
     * Check if request is declined
     */
    public function isDeclined(): bool
    {
        return $this->status === 'declined';
    }
}
