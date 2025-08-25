<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\PostLike;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostLikeController extends Controller
{
    public function like(Request $request, $postId)
    {
        $userId = Auth::id();
        $like = PostLike::firstOrCreate([
            'post_id' => $postId,
            'user_id' => $userId,
        ]);

        $post = Post::findOrFail($postId);
        if ($post->user_id !== $userId) {
            Notification::create([
                'user_id' => $post->user_id,
                'sender_id' => $userId,
                'type' => 'post_liked',
                'content' => 'liked your post',
                'reference_id' => $postId,
            ]);
        }

        return response()->json(['liked' => true, 'count' => PostLike::where('post_id', $postId)->count()]);
    }

    public function unlike(Request $request, $postId)
    {
        $userId = Auth::id();
        PostLike::where('post_id', $postId)->where('user_id', $userId)->delete();
        return response()->json(['liked' => false, 'count' => PostLike::where('post_id', $postId)->count()]);
    }

    public function status($postId)
    {
        $userId = Auth::id();
        $liked = PostLike::where('post_id', $postId)->where('user_id', $userId)->exists();
        $count = PostLike::where('post_id', $postId)->count();
        return response()->json(['liked' => $liked, 'count' => $count]);
    }
}
