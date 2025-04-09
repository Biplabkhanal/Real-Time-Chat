<?php

namespace App\Listeners;

use App\Events\MessageSent;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateMessageNotification implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MessageSent $event): void
    {
        // Create notification for recipient
        Notification::create([
            'user_id' => $event->message->recipient_id,
            'type' => 'message',
            'sender_id' => $event->message->sender_id,
            'content' => 'sent you a message',
            'reference_id' => $event->message->id,
            'is_read' => false,
        ]);
    }
}
