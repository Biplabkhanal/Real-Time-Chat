<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MessagePinned  implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new Channel('messages.' . $this->message->receiver_id);
    }
}
