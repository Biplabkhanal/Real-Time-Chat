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
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * Display inbox page with users
     */
    public function inbox()
    {
        $users = User::where('id', '!=', Auth::id())->get();
        return Inertia::render('Inbox', ['users' => $users]);
    }

    /**
     * Store a new message
     */
    public function store(Request $request, User $user)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'message' => 'nullable|string',
                'attachments' => 'nullable|array',
                'attachments.*' => 'required',
                'attachment' => 'nullable',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            if ($request->has('attachments') && is_array($request->attachments) && count($request->attachments) > 0) {
                return $this->storeMultipleAttachments($request, $user);
            } else {
                return $this->storeSingleMessage($request, $user);
            }
        } catch (\Exception $e) {
            Log::error('Error sending message: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a message with multiple attachments
     */
    private function storeMultipleAttachments(Request $request, User $user)
    {
        $sentMessages = [];
        $senderId = Auth::id();
        $recipientId = $user->id;
        $messageText = $request->message ?? '';

        // Create the first message with text and first attachment
        $firstMessage = $this->createMessage(
            $senderId,
            $recipientId,
            $messageText,
            isset($request->attachments[0]) ? $request->attachments[0] : null
        );

        $sentMessages[] = $firstMessage;
        $this->broadcastMessage($firstMessage);

        // Create additional messages for remaining attachments
        if (count($request->attachments) > 1) {
            for ($i = 1; $i < count($request->attachments); $i++) {
                $message = $this->createMessage($senderId, $recipientId, '', $request->attachments[$i]);
                $sentMessages[] = $message;
                $this->broadcastMessage($message);
            }
        }

        return response()->json($sentMessages);
    }

    /**
     * Store a single message
     */
    private function storeSingleMessage(Request $request, User $user)
    {
        $message = $this->createMessage(
            Auth::id(),
            $user->id,
            $request->message ?? '',
            $request->has('attachment') ? $request->attachment : null
        );

        $this->broadcastMessage($message);
        return response()->json($message);
    }

    /**
     * Create a new message
     */
    private function createMessage($senderId, $recipientId, $messageText, $attachment = null)
    {
        $message = new Message;
        $message->sender_id = $senderId;
        $message->recipient_id = $recipientId;
        $message->message = $messageText;

        if ($attachment) {
            $message->attachment = json_encode($attachment);
        }

        $message->save();
        return $message;
    }

    /**
     * Broadcast a message to other users
     */
    private function broadcastMessage(Message $message)
    {
        broadcast(new MessageSent($message, Auth::user()))->toOthers();
    }

    /**
     * Get messages between two users
     */
    public function show(User $user)
    {
        $currentUserId = Auth::id();
        $otherUserId = $user->id;

        $messages = $this->getConversationMessages($currentUserId, $otherUserId);
        return response()->json($messages);
    }

    /**
     * Get messages between two users
     */
    private function getConversationMessages($user1Id, $user2Id)
    {
        return Message::where(function ($query) use ($user1Id, $user2Id) {
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
    }

    /**
     * Delete a message
     */
    public function destroy(Message $message)
    {
        try {
            // Check if the user is authorized to delete this message
            if ($message->sender_id !== Auth::id()) {
                return response()->json(['error' => 'Unauthorized. You can only delete your own messages.'], 403);
            }

            $this->deleteAttachment($message);
            $message->delete();

            broadcast(new MessageDeleted($message->id, $message->recipient_id))->toOthers();
            return response()->json(['success' => 'Message deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting message: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete an entire conversation
     */
    public function destroyConversation(User $user)
    {
        try {
            $currentUserId = Auth::id();
            $otherUserId = $user->id;

            // Get all messages
            $messages = $this->getConversationMessages($currentUserId, $otherUserId);

            // Delete attachments
            foreach ($messages as $message) {
                $this->deleteAttachment($message);
            }

            // Delete all messages in one query
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

    /**
     * Delete attachment from storage
     */
    private function deleteAttachment($message)
    {
        if ($message->attachment) {
            $attachment = json_decode($message->attachment);
            if (isset($attachment->path) && $attachment->path) {
                if (Storage::disk('public')->exists($attachment->path)) {
                    Storage::disk('public')->delete($attachment->path);
                }
            }
        }
    }

    /**
     * Get shared media between two users
     */
    public function getSharedMedia(Request $request, $userId)
    {
        $currentUserId = Auth::id();

        // Fetch shared media files between current user and the selected user
        $messages = Message::where(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)
                ->where('recipient_id', $userId);
        })
            ->orWhere(function ($query) use ($currentUserId, $userId) {
                $query->where('sender_id', $userId)
                    ->where('recipient_id', $currentUserId);
            })
            ->whereNotNull('attachment')
            ->orderBy('created_at', 'desc')
            ->get();

        $media = $messages->map(function ($message) {
            $attachment = json_decode($message->attachment);
            return [
                'id' => $message->id,
                'path' => $attachment->path ?? null,
                'type' => $attachment->type ?? $this->getFileType($attachment->path ?? ''),
                'name' => $attachment->name ?? $this->getFileName($attachment->path ?? ''),
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
        if (!$path) return 'unknown';

        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls' => 'application/vnd.ms-excel',
        ];

        return $mimeTypes[$extension] ?? 'application/octet-stream';
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
