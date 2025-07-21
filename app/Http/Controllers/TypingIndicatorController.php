<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\UserTyping;
use Illuminate\Support\Facades\Auth;

class TypingIndicatorController extends Controller
{
    public function typing(Request $request)
    {
        $senderId = Auth::id();
        $recipientId = $request->input('recipient_id');
        if ($senderId && $recipientId) {
            broadcast(new UserTyping($senderId, $recipientId))->toOthers();
            return response()->json(['status' => 'ok']);
        }
        return response()->json(['status' => 'error'], 400);
    }
}
