<?php

namespace App\Http\Controllers;

use App\Models\BlockedUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlockUserController extends Controller
{
    public function blockUser(Request $request)
    {
        $validated = $request->validate([
            'blocked_user_id' => 'required|exists:users,id'
        ]);

        // Check if already blocked
        $existingBlock = BlockedUser::where('user_id', Auth::id())
            ->where('blocked_user_id', $validated['blocked_user_id'])
            ->first();

        if ($existingBlock) {
            return response()->json(['message' => 'User already blocked'], 200);
        }

        // Create new block
        BlockedUser::create([
            'user_id' => Auth::id(),
            'blocked_user_id' => $validated['blocked_user_id']
        ]);

        return response()->json(['message' => 'User blocked successfully'], 201);
    }

    public function unblockUser(User $user)
    {
        BlockedUser::where('user_id', Auth::id())
            ->where('blocked_user_id', $user->id)
            ->delete();

        return response()->json(['message' => 'User unblocked successfully'], 200);
    }

    public function checkBlockStatus(User $user)
    {
        $isBlocked = BlockedUser::where('user_id', Auth::id())
            ->where('blocked_user_id', $user->id)
            ->exists();

        $isBlockedByUser = BlockedUser::where('user_id', $user->id)
            ->where('blocked_user_id', Auth::id())
            ->exists();

        return response()->json([
            'isBlocked' => $isBlocked,
            'isBlockedByUser' => $isBlockedByUser
        ]);
    }

    public function getBlockedUsers()
    {
        $blockedUserIds = BlockedUser::where('user_id', Auth::id())
            ->pluck('blocked_user_id');

        $blockedUsers = User::whereIn('id', $blockedUserIds)->get();

        return response()->json($blockedUsers);
    }
}
