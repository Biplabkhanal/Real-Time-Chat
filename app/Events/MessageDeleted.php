<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messageId;
    public $recipientId;
    public $isEntireConversation = false;

    /**
     * Create a new event instance.
     *
     * @param int $messageId
     * @param int $recipientId
     * @return void
     */
    public function __construct($messageId, $recipientId, $isEntireConversation = false)
    {
        $this->messageId = $messageId;
        $this->recipientId = $recipientId;
        $this->isEntireConversation = $isEntireConversation;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('message.' . $this->recipientId);
    }
}
