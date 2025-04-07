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
use Barryvdh\DomPDF\Facade\Pdf;

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

            if (!$this->canSendMessage($user->id)) {
                return response()->json(['error' => 'Cannot send message to this user'], 403);
            }

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


    /**
     * Get users with conversations
     */
    public function getUsersWithConversations()
    {
        $currentUserId = Auth::id();

        // Find users who have exchanged messages with the current user
        $userIds = Message::where(function ($query) use ($currentUserId) {
            $query->where('sender_id', $currentUserId)
                ->orWhere('recipient_id', $currentUserId);
        })
            ->pluck('sender_id')
            ->merge(Message::where(function ($query) use ($currentUserId) {
                $query->where('sender_id', $currentUserId)
                    ->orWhere('recipient_id', $currentUserId);
            })
                ->pluck('recipient_id'))
            ->unique()
            ->reject(function ($id) use ($currentUserId) {
                return $id === $currentUserId;
            });

        // Get user details for these IDs
        $users = User::whereIn('id', $userIds)->get();

        return response()->json($users);
    }

    /**
     * Get statistics about the conversation between two users
     */
    public function getConversationStats(User $user)
    {
        $currentUserId = Auth::id();
        $otherUserId = $user->id;

        // Get all messages between the two users
        $messages = Message::where(function ($query) use ($currentUserId, $otherUserId) {
            $query->where('sender_id', $currentUserId)
                ->where('recipient_id', $otherUserId);
        })->orWhere(function ($query) use ($currentUserId, $otherUserId) {
            $query->where('sender_id', $otherUserId)
                ->where('recipient_id', $currentUserId);
        })->orderBy('created_at', 'asc')->get();

        if ($messages->isEmpty()) {
            return response()->json([
                'total_messages' => 0,
                'your_messages' => 0,
                'their_messages' => 0,
                'days_talking' => 0
            ]);
        }

        // Calculate statistics
        $yourMessages = $messages->where('sender_id', $currentUserId)->count();
        $theirMessages = $messages->where('sender_id', $otherUserId)->count();

        $firstMessage = $messages->first();
        $latestMessage = $messages->last();

        // Calculate unique days they've talked
        $uniqueDays = $messages->groupBy(function ($message) {
            return $message->created_at->format('Y-m-d');
        });

        // Find the busiest day
        $busyDay = null;
        $maxCount = 0;

        foreach ($uniqueDays as $date => $msgs) {
            $count = count($msgs);
            if ($count > $maxCount) {
                $maxCount = $count;
                $busyDay = [
                    'date' => $date,
                    'count' => $count
                ];
            }
        }

        return response()->json([
            'total_messages' => $messages->count(),
            'your_messages' => $yourMessages,
            'their_messages' => $theirMessages,
            'days_talking' => $uniqueDays->count(),
            'first_message_date' => $firstMessage->created_at,
            'first_message_by' => $firstMessage->sender_id,
            'latest_message_date' => $latestMessage->created_at,
            'latest_message_by' => $latestMessage->sender_id,
            'busy_day' => $busyDay
        ]);
    }


    /**
     * Export conversation history
     */
    public function exportConversation(Request $request, User $user)
    {
        $format = $request->query('format', 'pdf');
        $currentUserId = Auth::id();
        $otherUserId = $user->id;

        // Get all messages between the users
        $messages = $this->getConversationMessages($currentUserId, $otherUserId);

        if ($messages->isEmpty()) {
            return response()->json(['error' => 'No messages to export'], 404);
        }

        // Format user names
        $currentUser = Auth::user();
        $otherUser = $user;

        if ($format === 'csv') {
            return $this->exportToCsv($messages, $currentUser, $otherUser);
        } else {
            return $this->exportToPdf($messages, $currentUser, $otherUser);
        }
    }

    /**
     * Export to CSV format
     */
    private function exportToCsv($messages, $currentUser, $otherUser)
    {
        $filename = 'conversation_with_' . $otherUser->name . '_' . date('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($messages, $currentUser, $otherUser) {
            $file = fopen('php://output', 'w');

            // Add CSV headers
            fputcsv($file, ['Timestamp', 'Sender', 'Message', 'Attachment']);

            foreach ($messages as $message) {
                $sender = ($message->sender_id === $currentUser->id) ? $currentUser->name : $otherUser->name;
                $attachment = !empty($message->attachment) ? 'Yes' : 'No';

                fputcsv($file, [
                    $message->created_at->format('Y-m-d H:i:s'),
                    $sender,
                    $message->message,
                    $attachment
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export to PDF format
     */
    public function exportToPdf($messages, $currentUser, $otherUser)
    {
        // Process messages to encode image attachments
        foreach ($messages as $message) {
            if (!empty($message->attachment)) {
                $attachmentPath = is_object($message->attachment)
                    ? $message->attachment->path ?? ''
                    : $message->attachment;

                if (is_string($attachmentPath) && !empty($attachmentPath)) {
                    $fileExtension = pathinfo($attachmentPath, PATHINFO_EXTENSION);
                    $isImage = in_array(strtolower($fileExtension), ['jpg', 'jpeg', 'png', 'gif', 'webp']);

                    if ($isImage) {
                        $fullPath = storage_path('app/public/chat_attachments/' . $attachmentPath);
                        if (file_exists($fullPath)) {
                            $fileContent = file_get_contents($fullPath);
                            $base64 = base64_encode($fileContent);
                            $mime = mime_content_type($fullPath);
                            $message->imageData = "data:$mime;base64,$base64";
                        }
                    }
                }
            }
        }

        $pdf = PDF::loadView('exports.conversation', [
            'messages' => $messages,
            'currentUser' => $currentUser,
            'otherUser' => $otherUser
        ]);

        return $pdf->download('conversation_' . $currentUser->id . '_' . $otherUser->id . '.pdf');
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

    /**
     * Check if messaging is allowed between users
     */
    private function canSendMessage($receiverId)
    {
        // Check if either user has blocked the other
        $isBlocked = \App\Models\BlockedUser::where(function ($query) use ($receiverId) {
            $query->where('user_id', Auth::id())
                ->where('blocked_user_id', $receiverId);
        })->orWhere(function ($query) use ($receiverId) {
            $query->where('user_id', $receiverId)
                ->where('blocked_user_id', Auth::id());
        })->exists();

        return !$isBlocked;
    }
}
