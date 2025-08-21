<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('user')->latest()->get();
        return Inertia::render('Feed', [
            'posts' => $posts,
            'csrf_token' => csrf_token(),
            'auth' => [
                'user' => Auth::user(),
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
}
