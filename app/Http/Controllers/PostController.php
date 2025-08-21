<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $friendIds = $user->friends()->pluck('users.id')->toArray();
        $posts = Post::with('user')
            ->whereIn('user_id', array_merge($friendIds, [$user->id]))
            ->latest()
            ->get();
        if ($request->expectsJson()) {
            return response()->json(['posts' => $posts]);
        }
        return Inertia::render('Feed/Feed', [
            'posts' => $posts,
            'csrf_token' => csrf_token(),
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        $post = Post::create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            'image_path' => $imagePath,
        ]);

        return response()->json($post, 201);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        if ($post->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $request->validate([
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
            $post->image_path = $imagePath;
        }
        if ($request->filled('content')) {
            $post->content = $request->content;
        }
        $post->save();
        return response()->json($post);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        if ($post->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $post->delete();
        return response()->json(['message' => 'Post deleted']);
    }

    public function share(Request $request, $postId, $friendId)
    {
        $user = Auth::user();
        $post = Post::findOrFail($postId);
        $messageContent = "Shared a post: " . $post->content;
        $friend = User::findOrFail($friendId);
        $friend->messages()->create([
            'sender_id' => $user->id,
            'recipient_id' => $friend->id,
            'message' => $messageContent,
            'attachment' => $post->image_path ?? null,
        ]);
        return response()->json(['success' => true]);
    }
}
