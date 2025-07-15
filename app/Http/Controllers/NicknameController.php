<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class NicknameController extends Controller
{
    /**
     * Set or update nickname for a friend
     */
    public function setNickname(Request $request, User $friend)
    {
        $validator = Validator::make($request->all(), [
            'nickname' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $currentUser = Auth::user();

        if (!$currentUser->isFriendsWith($friend->id)) {
            return response()->json(['error' => 'You are not friends with this user'], 403);
        }

        $nickname = $request->input('nickname');

        $updated = $currentUser->setNicknameForFriend($friend->id, $nickname);

        if ($updated) {
            return response()->json([
                'message' => $nickname ? 'Nickname updated successfully' : 'Nickname removed successfully',
                'nickname' => $nickname,
                'display_name' => $nickname ?: $friend->name
            ]);
        }

        return response()->json(['error' => 'Failed to update nickname'], 500);
    }

    /**
     * Get nickname for a friend
     */
    public function getNickname(User $friend)
    {
        $currentUser = Auth::user();

        if (!$currentUser->isFriendsWith($friend->id)) {
            return response()->json(['error' => 'You are not friends with this user'], 403);
        }

        $nickname = $currentUser->getNicknameForFriend($friend->id);

        return response()->json([
            'nickname' => $nickname,
            'display_name' => $nickname ?: $friend->name
        ]);
    }
}
