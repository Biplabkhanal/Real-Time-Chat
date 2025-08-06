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
            $event = new UserTyping($senderId, $recipientId);
            broadcast($event)->toOthers();
            return response()->json(['status' => 'ok']);
        }
        return response()->json(['status' => 'error'], 400);
    }
}
