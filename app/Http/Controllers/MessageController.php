<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function inbox()
    {
        $users = User::where('id', '!=', Auth::user()->id)->get();
        return Inertia::render('Inbox', ['users' => $users]);
    }

    public function store(Request $request, User $user)
    {
        try {
            // Handle multiple attachments
            if ($request->has('attachments') && is_array($request->attachments) && count($request->attachments) > 0) {
                $sentMessages = [];

                // Create a message with text content (if any) and the first attachment
                $firstMessage = new Message;
                $firstMessage->sender_id = Auth::user()->id;
                $firstMessage->recipient_id = $user->id;
                $firstMessage->message = $request->message ?? '';

                if (isset($request->attachments[0])) {
                    $firstMessage->attachment = json_encode($request->attachments[0]);
                }

                $firstMessage->save();
                $sentMessages[] = $firstMessage;

                // Broadcast the first message
                broadcast(new MessageSent($firstMessage, Auth::user()))->toOthers();

                // For additional attachments, create separate messages (without text content)
                if (count($request->attachments) > 1) {
                    for ($i = 1; $i < count($request->attachments); $i++) {
                        $additionalMessage = new Message;
                        $additionalMessage->sender_id = Auth::user()->id;
                        $additionalMessage->recipient_id = $user->id;
                        $additionalMessage->message = '';
                        $additionalMessage->attachment = json_encode($request->attachments[$i]);
                        $additionalMessage->save();

                        $sentMessages[] = $additionalMessage;

                        // Optional: broadcast each additional message if needed
                        broadcast(new MessageSent($additionalMessage, Auth::user()))->toOthers();
                    }
                }

                return response()->json($sentMessages);
            } else {
                // Single message with no attachments or a single attachment
                $message = new Message;
                $message->sender_id = Auth::user()->id;
                $message->recipient_id = $user->id;
                $message->message = $request->message ?? '';

                // Handle single attachment if present
                if ($request->has('attachment') && $request->attachment) {
                    $message->attachment = json_encode($request->attachment);
                }

                $message->save();

                broadcast(new MessageSent($message, Auth::user()))->toOthers();

                return response()->json($message);
            }
        } catch (\Exception $e) {
            Log::error('Error sending message: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(User $user)
    {
        $user1Id = Auth::user()->id;
        $user2Id = $user->id;

        $messages = Message::where(function ($query) use ($user1Id, $user2Id) {
            $query->where('sender_id', $user1Id)
                ->where('recipient_id', $user2Id);
        })
            ->orWhere(function ($query) use ($user1Id, $user2Id) {
                $query->where('sender_id', $user2Id)
                    ->where('recipient_id', $user1Id);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                // Convert attachment JSON string back to object if present
                if ($message->attachment) {
                    $message->attachment = json_decode($message->attachment);
                }
                return $message;
            });

        return response()->json($messages);
    }
}
