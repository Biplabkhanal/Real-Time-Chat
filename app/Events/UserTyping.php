<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserTyping implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $senderId;
    public $recipientId;

    public function __construct($senderId, $recipientId)
    {
        $this->senderId = $senderId;
        $this->recipientId = $recipientId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('message.' . $this->recipientId);
    }

    public function broadcastWith()
    {
        return [
            'senderId' => $this->senderId,
            'recipientId' => $this->recipientId,
        ];
    }

    public function broadcastAs()
    {
        return 'UserTyping';
    }
}
