<?php

namespace App\Http\Controllers;

use App\Events\MessageDeleted;
use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
                if (count($request->attachments) > 1) {
                    for ($i = 1; $i < count($request->attachments); $i++) {
                        $additionalMessage = new Message;
                        $additionalMessage->sender_id = Auth::user()->id;
                        $additionalMessage->recipient_id = $user->id;
                        $additionalMessage->message = '';
                        $additionalMessage->attachment = json_encode($request->attachments[$i]);
                        $additionalMessage->save();

                        $sentMessages[] = $additionalMessage;

                        broadcast(new MessageSent($additionalMessage, Auth::user()))->toOthers();
                    }
                }

                return response()->json($sentMessages);
            } else {

                $message = new Message;
                $message->sender_id = Auth::user()->id;
                $message->recipient_id = $user->id;
                $message->message = $request->message ?? '';

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
                if ($message->attachment) {
                    $message->attachment = json_decode($message->attachment);
                }
                return $message;
            });

        return response()->json($messages);
    }

    /**
     * Delete a message
     *
     * @param Message $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Message $message)
    {
        try {
            // Check if the user is authorized to delete this message
            if ($message->sender_id !== Auth::id()) {
                return response()->json(['error' => 'Unauthorized. You can only delete your own messages.'], 403);
            }

            if ($message->attachment) {
                $attachment = json_decode($message->attachment);
                if (isset($attachment->path) && $attachment->path) {
                    if (Storage::disk('public')->exists($attachment->path)) {
                        Storage::disk('public')->delete($attachment->path);
                    }
                }
            }

            // Delete the message
            $message->delete();

            broadcast(new MessageDeleted($message->id, $message->recipient_id))->toOthers();

            return response()->json(['success' => 'Message deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting message: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyConversation(User $user)
    {
        try {
            $currentUserId = Auth::id();
            $otherUserId = $user->id;

            // Find all messages between the two users
            $messages = Message::where(function ($query) use ($currentUserId, $otherUserId) {
                $query->where('sender_id', $currentUserId)
                    ->where('recipient_id', $otherUserId);
            })->orWhere(function ($query) use ($currentUserId, $otherUserId) {
                $query->where('sender_id', $otherUserId)
                    ->where('recipient_id', $currentUserId);
            })->get();

            // Delete attachments from storage
            foreach ($messages as $message) {
                if ($message->attachment) {
                    $attachment = json_decode($message->attachment);
                    if (isset($attachment->path) && $attachment->path) {
                        if (Storage::disk('public')->exists($attachment->path)) {
                            Storage::disk('public')->delete($attachment->path);
                        }
                    }
                }
            }

            // Delete all messages
            Message::where(function ($query) use ($currentUserId, $otherUserId) {
                $query->where('sender_id', $currentUserId)
                    ->where('recipient_id', $otherUserId);
            })->orWhere(function ($query) use ($currentUserId, $otherUserId) {
                $query->where('sender_id', $otherUserId)
                    ->where('recipient_id', $currentUserId);
            })->delete();

            broadcast(new MessageDeleted(null, $otherUserId, true))->toOthers();

            return response()->json(['success' => 'Conversation deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting conversation: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getSharedMedia(Request $request, $userId)
    {
        $currentUserId = auth()->id();

        // Fetch shared media files between current user and the selected user
        $media = Message::where(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)
                ->where('recipient_id', $userId);
        })
            ->orWhere(function ($query) use ($currentUserId, $userId) {
                $query->where('sender_id', $userId)
                    ->where('recipient_id', $currentUserId);
            })
            ->whereNotNull('attachment') // Only get messages with attachments
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($message) {
                // Extract media information
                return [
                    'id' => $message->id,
                    'path' => $message->attachment,
                    'type' => $this->getFileType($message->attachment),
                    'name' => $this->getFileName($message->attachment),
                    'is_link' => $this->isLink($message->message),
                    'url' => $this->extractUrl($message->message),
                    'title' => $message->message,
                    'created_at' => $message->created_at
                ];
            });

        return response()->json($media);
    }

    // Helper methods
    private function getFileType($path)
    {
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        switch ($extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'image/' . $extension;
            case 'pdf':
                return 'application/pdf';
            case 'doc':
            case 'docx':
                return 'application/msword';
            case 'xlsx':
            case 'xls':
                return 'application/excel';
            default:
                return 'application/octet-stream';
        }
    }

    private function getFileName($path)
    {
        if (!$path) return 'Unknown file';
        return pathinfo($path, PATHINFO_FILENAME);
    }

    private function isLink($message)
    {
        if (!$message) return false;
        return preg_match('/https?:\/\/[^\s]+/', $message) === 1;
    }

    private function extractUrl($message)
    {
        if (!$message) return '';
        preg_match('/https?:\/\/[^\s]+/', $message, $matches);
        return $matches[0] ?? '';
    }
}
