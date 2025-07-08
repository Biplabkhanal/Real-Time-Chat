<?php

namespace App\Http\Controllers;

use App\Events\FriendRequestReceived;
use App\Events\FriendRequestAccepted;
use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FriendRequestController extends Controller
{
    /**
     * Send a friend request
     */
    public function send(Request $request, User $user)
    {
        $currentUser = Auth::user();

        if ($currentUser->id === $user->id) {
            return response()->json(['error' => 'You cannot send a friend request to yourself'], 400);
        }

        if ($currentUser->isFriendsWith($user->id)) {
            return response()->json(['error' => 'You are already friends with this user'], 400);
        }

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
            if ($existingRequest->status === 'declined' || $existingRequest->status === 'accepted') {
                $existingRequest->update([
                    'sender_id' => $currentUser->id,
                    'receiver_id' => $user->id,
                    'status' => 'pending'
                ]);
            }
        } else {
            $friendRequest = FriendRequest::create([
                'sender_id' => $currentUser->id,
                'receiver_id' => $user->id,
                'status' => 'pending'
            ]);
        }

        try {
            broadcast(new FriendRequestReceived($user, $currentUser))->toOthers();
        } catch (\Exception $e) {
            Log::warning('Failed to broadcast friend request event: ' . $e->getMessage());
        }

        $requestId = $existingRequest ? $existingRequest->id : $friendRequest->id;

        return response()->json([
            'message' => 'Friend request sent successfully',
            'request_id' => $requestId
        ]);
    }

    /**
     * Accept a friend request
     */
    public function accept(FriendRequest $friendRequest)
    {
        try {
            $currentUser = Auth::user();

            if ($friendRequest->receiver_id !== $currentUser->id) {
                if (request()->header('X-Inertia')) {
                    return redirect()->back()->withErrors(['error' => 'Unauthorized']);
                }
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            if (!$friendRequest->isPending()) {
                if (request()->header('X-Inertia')) {
                    return redirect()->back()->withErrors(['error' => 'Friend request is no longer pending']);
                }
                return response()->json(['error' => 'Friend request is no longer pending'], 400);
            }

            if ($currentUser->isFriendsWith($friendRequest->sender_id)) {
                if (request()->header('X-Inertia')) {
                    return redirect()->back()->withErrors(['error' => 'You are already friends with this user']);
                }
                return response()->json(['error' => 'You are already friends with this user'], 400);
            }

            $friendRequest->accept();

            try {
                broadcast(new FriendRequestAccepted($friendRequest->sender, $currentUser))->toOthers();
            } catch (\Exception $e) {
                Log::warning('Failed to broadcast friend request accepted event: ' . $e->getMessage());
            }

            if (request()->header('X-Inertia')) {
                return redirect()->back()->with('success', 'Friend request accepted');
            }

            return response()->json(['message' => 'Friend request accepted']);
        } catch (\Exception $e) {
            Log::error('Error accepting friend request: ' . $e->getMessage(), [
                'friend_request_id' => $friendRequest->id,
                'user_id' => Auth::id()
            ]);

            if (request()->header('X-Inertia')) {
                return redirect()->back()->withErrors(['error' => 'Failed to accept friend request. Please try again.']);
            }

            return response()->json(['error' => 'Failed to accept friend request. Please try again.'], 500);
        }
    }

    /**
     * Decline a friend request
     */
    public function decline(FriendRequest $friendRequest)
    {
        $currentUser = Auth::user();

        if ($friendRequest->receiver_id !== $currentUser->id) {
            if (request()->header('X-Inertia')) {
                return redirect()->back()->withErrors(['error' => 'Unauthorized']);
            }
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!$friendRequest->isPending()) {
            if (request()->header('X-Inertia')) {
                return redirect()->back()->withErrors(['error' => 'Friend request is no longer pending']);
            }
            return response()->json(['error' => 'Friend request is no longer pending'], 400);
        }

        $friendRequest->decline();

        if (request()->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Friend request declined');
        }

        return response()->json(['message' => 'Friend request declined']);
    }

    /**
     * Cancel a sent friend request
     */
    public function cancel(FriendRequest $friendRequest)
    {
        $currentUser = Auth::user();

        if ($friendRequest->sender_id !== $currentUser->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!$friendRequest->isPending()) {
            return response()->json(['error' => 'Friend request is no longer pending'], 400);
        }

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

        if (!$currentUser->isFriendsWith($friend->id)) {
            if (request()->header('X-Inertia')) {
                return redirect()->back()->withErrors(['error' => 'You are not friends with this user']);
            }
            return response()->json(['error' => 'You are not friends with this user'], 400);
        }

        $currentUser->friendships()->where('friend_id', $friend->id)->delete();
        $friend->friendships()->where('friend_id', $currentUser->id)->delete();

        if (request()->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Friend removed successfully');
        }

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

        if (!empty($search)) {
            $query->where(function ($subQuery) use ($search) {
                $subQuery->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
            $query->limit(10);
        } else {

            $query->limit(20);
        }

        $users = $query->get(['id', 'name', 'email', 'avatar']);

        $users = $users->map(function ($user) use ($currentUser) {
            $user->is_friend = $currentUser->isFriendsWith($user->id);
            $user->has_sent_request = $currentUser->hasSentFriendRequestTo($user->id);
            $user->has_received_request = $currentUser->hasReceivedFriendRequestFrom($user->id);

            if ($user->has_sent_request) {
                $sentRequest = $currentUser->sentFriendRequests()
                    ->where('receiver_id', $user->id)
                    ->where('status', 'pending')
                    ->first();
                $user->sent_request_id = $sentRequest ? $sentRequest->id : null;
            }

            return $user;
        });

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
