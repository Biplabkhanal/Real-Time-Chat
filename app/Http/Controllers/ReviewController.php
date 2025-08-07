<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            ->where('published', true)
            ->orderBy('created_at', 'desc')
            ->paginate(6);

        return inertia('Welcome', [
            'reviews' => $reviews
        ]);
    }

    public function destroy(Review $review)
    {
        if ($review->user_id !== Auth::id()) {
            return back()->with('error', 'You can only delete your own reviews.');
        }

        $review->delete();

        return back()->with('success', 'Review deleted successfully!');
    }
}
