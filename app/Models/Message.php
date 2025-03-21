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
        'is_read'
    ];

    protected $casts = [
        'is_read' => 'boolean'
    ];
}
