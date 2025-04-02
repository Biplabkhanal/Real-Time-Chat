<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:500',
            'rating' => 'required|integer|between:1,5'
        ]);

        $review = $request->user()->reviews()->create($validated);

        return back()->with('success', 'Review submitted successfully!');
    }

    public function index()
    {
        $reviews = Review::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(6);

        return inertia('Welcome', [
            'reviews' => $reviews
        ]);
    }
}
