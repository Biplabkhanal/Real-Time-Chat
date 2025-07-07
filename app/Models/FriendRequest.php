<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

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
        DB::beginTransaction();

        try {
            $this->update(['status' => 'accepted']);

            $existingFriendship1 = Friendship::where('user_id', $this->sender_id)
                ->where('friend_id', $this->receiver_id)
                ->first();

            $existingFriendship2 = Friendship::where('user_id', $this->receiver_id)
                ->where('friend_id', $this->sender_id)
                ->first();

            if (!$existingFriendship1) {
                Friendship::create([
                    'user_id' => $this->sender_id,
                    'friend_id' => $this->receiver_id,
                ]);
            }

            if (!$existingFriendship2) {
                Friendship::create([
                    'user_id' => $this->receiver_id,
                    'friend_id' => $this->sender_id,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
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
