<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FriendRequestAccepted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $sender;
    public $accepter;

    /**
     * Create a new event instance.
     */
    public function __construct(User $sender, User $accepter)
    {
        $this->sender = $sender;
        $this->accepter = $accepter;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->sender->id),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'message' => $this->accepter->name . ' accepted your friend request',
            'accepter' => [
                'id' => $this->accepter->id,
                'name' => $this->accepter->name,
                'email' => $this->accepter->email,
                'avatar' => $this->accepter->avatar,
            ],
            'type' => 'friend_request_accepted'
        ];
    }
}
