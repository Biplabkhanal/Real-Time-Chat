<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_online',
        'last_seen_at',
        'avatar',


    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_online' => 'boolean',
            'last_seen_at' => 'datetime',
            'joined_at' => 'datetime',
        ];
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id')
            ->orWhere('recipient_id', $this->id);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($user) {
            $user->messages()->delete();
        });

        static::creating(function ($user) {
            $user->joined_at = now();
        });
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function blockedUsers()
    {
        return $this->hasMany(BlockedUser::class, 'user_id');
    }

    public function blockedBy()
    {
        return $this->hasMany(BlockedUser::class, 'blocked_user_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // Friend Request Relationships
    public function sentFriendRequests()
    {
        return $this->hasMany(FriendRequest::class, 'sender_id');
    }

    public function receivedFriendRequests()
    {
        return $this->hasMany(FriendRequest::class, 'receiver_id');
    }

    public function friendships()
    {
        return $this->hasMany(Friendship::class, 'user_id');
    }

    // Get all friends
    public function friends()
    {
        return $this->belongsToMany(User::class, 'friendships', 'user_id', 'friend_id')
            ->withTimestamps()
            ->select('users.id', 'users.name', 'users.email', 'users.avatar', 'users.is_online', 'users.last_seen_at');
    }

    // Check if user is friends with another user
    public function isFriendsWith($userId)
    {
        return $this->belongsToMany(User::class, 'friendships', 'user_id', 'friend_id')
            ->where('friend_id', $userId)
            ->exists();
    }

    // Check if user has sent a friend request to another user
    public function hasSentFriendRequestTo($userId)
    {
        return $this->sentFriendRequests()
            ->where('receiver_id', $userId)
            ->where('status', 'pending')
            ->exists();
    }

    // Check if user has received a friend request from another user
    public function hasReceivedFriendRequestFrom($userId)
    {
        return $this->receivedFriendRequests()
            ->where('sender_id', $userId)
            ->where('status', 'pending')
            ->exists();
    }

    // Get pending friend requests received by user
    public function pendingFriendRequests()
    {
        return $this->receivedFriendRequests()
            ->where('status', 'pending')
            ->with('sender');
    }

    // Check if users can message each other (they must be friends)
    public function canMessageUser($userId)
    {
        return $this->isFriendsWith($userId);
    }
}
