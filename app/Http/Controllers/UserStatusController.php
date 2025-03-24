<?php

namespace App\Http\Controllers;

use App\Events\UserStatusChanged;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class UserStatusController extends Controller
{
    public function getOnlineUsers(): JsonResponse
    {
        $users = User::where('id', '!=', auth()->id())
            ->select('id', 'name', 'is_online', 'last_seen_at')
            ->get();

        return response()->json($users);
    }

    public function updateStatus(): JsonResponse
    {
        $user = auth()->user();
        $user->update(['is_online' => true, 'last_seen_at' => now()]);

        broadcast(new UserStatusChanged($user))->toOthers();

        return response()->json(['status' => 'success']);
    }
}
