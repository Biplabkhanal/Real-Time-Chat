<?php

namespace App\Http\Controllers;

use App\Events\FriendRequestReceived;
use App\Events\FriendRequestAccepted;
use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FriendRequestController extends Controller
{
    /**
     * Send a friend request
     */
    public function send(Request $request, User $user)
    {
        $currentUser = Auth::user();

        // Check if user is trying to send request to themselves
        if ($currentUser->id === $user->id) {
            return response()->json(['error' => 'You cannot send a friend request to yourself'], 400);
        }

        // Check if they are already friends
        if ($currentUser->isFriendsWith($user->id)) {
            return response()->json(['error' => 'You are already friends with this user'], 400);
        }

        // Check if a friend request already exists
        $existingRequest = FriendRequest::where(function ($query) use ($currentUser, $user) {
            $query->where('sender_id', $currentUser->id)
                ->where('receiver_id', $user->id);
        })->orWhere(function ($query) use ($currentUser, $user) {
            $query->where('sender_id', $user->id)
                ->where('receiver_id', $currentUser->id);
        })->first();

        if ($existingRequest) {
            if ($existingRequest->status === 'pending') {
                return response()->json(['error' => 'Friend request already exists'], 400);
            }
            if ($existingRequest->status === 'declined') {
                // Update existing declined request to pending
                $existingRequest->update([
                    'sender_id' => $currentUser->id,
                    'receiver_id' => $user->id,
                    'status' => 'pending'
                ]);
            }
        } else {
            // Create new friend request
            $friendRequest = FriendRequest::create([
                'sender_id' => $currentUser->id,
                'receiver_id' => $user->id,
                'status' => 'pending'
            ]);
        }

        // Broadcast friend request event
        broadcast(new FriendRequestReceived($user, $currentUser))->toOthers();

        return response()->json(['message' => 'Friend request sent successfully']);
    }

    /**
     * Accept a friend request
     */
    public function accept(FriendRequest $friendRequest)
    {
        $currentUser = Auth::user();

        // Check if current user is the receiver
        if ($friendRequest->receiver_id !== $currentUser->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if request is still pending
        if (!$friendRequest->isPending()) {
            return response()->json(['error' => 'Friend request is no longer pending'], 400);
        }

        // Accept the request
        $friendRequest->accept();

        // Broadcast friend request accepted event
        broadcast(new FriendRequestAccepted($friendRequest->sender, $currentUser))->toOthers();

        return response()->json(['message' => 'Friend request accepted']);
    }

    /**
     * Decline a friend request
     */
    public function decline(FriendRequest $friendRequest)
    {
        $currentUser = Auth::user();

        // Check if current user is the receiver
        if ($friendRequest->receiver_id !== $currentUser->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if request is still pending
        if (!$friendRequest->isPending()) {
            return response()->json(['error' => 'Friend request is no longer pending'], 400);
        }

        // Decline the request
        $friendRequest->decline();

        return response()->json(['message' => 'Friend request declined']);
    }

    /**
     * Cancel a sent friend request
     */
    public function cancel(FriendRequest $friendRequest)
    {
        $currentUser = Auth::user();

        // Check if current user is the sender
        if ($friendRequest->sender_id !== $currentUser->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if request is still pending
        if (!$friendRequest->isPending()) {
            return response()->json(['error' => 'Friend request is no longer pending'], 400);
        }

        // Delete the request
        $friendRequest->delete();

        return response()->json(['message' => 'Friend request cancelled']);
    }

    /**
     * Get all pending friend requests for current user
     */
    public function pending()
    {
        $currentUser = Auth::user();

        $pendingRequests = $currentUser->pendingFriendRequests()->get();

        return response()->json($pendingRequests);
    }
    /**
     * Get all friends for current user
     */
    public function friends()
    {
        $currentUser = Auth::user();

        $friends = $currentUser->friends()->get();

        return response()->json($friends);
    }

    /**
     * Remove a friend
     */
    public function removeFriend(User $friend)
    {
        $currentUser = Auth::user();

        // Check if they are actually friends
        if (!$currentUser->isFriendsWith($friend->id)) {
            return response()->json(['error' => 'You are not friends with this user'], 400);
        }

        // Remove friendship (both directions)
        $currentUser->friendships()->where('friend_id', $friend->id)->delete();
        $friend->friendships()->where('friend_id', $currentUser->id)->delete();

        return response()->json(['message' => 'Friend removed successfully']);
    }

    /**
     * Search for users to send friend requests
     */
    public function searchUsers(Request $request)
    {
        $currentUser = Auth::user();
        $search = $request->get('search');

        $query = User::where('id', '!=', $currentUser->id);

        // If search query is provided, filter by name or email
        if (!empty($search)) {
            $query->where(function ($subQuery) use ($search) {
                $subQuery->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
            $query->limit(10);
        } else {
            // If no search query, return all non-friend users
            $query->limit(20); // Show more users when not searching
        }

        $users = $query->get(['id', 'name', 'email', 'avatar']);

        // Add friendship status for each user
        $users = $users->map(function ($user) use ($currentUser) {
            $user->is_friend = $currentUser->isFriendsWith($user->id);
            $user->has_sent_request = $currentUser->hasSentFriendRequestTo($user->id);
            $user->has_received_request = $currentUser->hasReceivedFriendRequestFrom($user->id);
            return $user;
        });

        // Filter out friends when no search query (show only non-friends)
        if (empty($search)) {
            $users = $users->filter(function ($user) {
                return !$user->is_friend;
            })->values();
        }

        return response()->json($users);
    }

    /**
     * Friend requests page     */
    public function index()
    {
        $currentUser = Auth::user();

        $pendingRequests = $currentUser->pendingFriendRequests()->get();
        $friends = $currentUser->friends()->get();

        return Inertia::render('FriendRequests', [
            'pendingRequests' => $pendingRequests,
            'friends' => $friends
        ]);
    }
}
