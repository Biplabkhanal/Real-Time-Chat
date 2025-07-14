<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'sender_id',
        'recipient_id',
        'message',
        'attachment',
        'is_read',
        'read_at',
        'forwarded_from'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime'
    ];

    public function markAsRead()
    {
        if (!$this->is_read) {
            $this->update([
                'is_read' => true,
                'read_at' => now()
            ]);
        }
    }

    public function markAsUnread()
    {
        if ($this->is_read) {
            $this->update(['is_read' => false]);
        }
    }

    public function isUnread()
    {
        return !$this->is_read;
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    public function originalMessage()
    {
        return $this->belongsTo(Message::class, 'forwarded_from');
    }

    public function forwardedMessages()
    {
        return $this->hasMany(Message::class, 'forwarded_from');
    }

    public function isForwarded()
    {
        return !is_null($this->forwarded_from);
    }
}
