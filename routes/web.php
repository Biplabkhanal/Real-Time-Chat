<?php

use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserStatusController;
use App\Models\Review;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'reviews' => Review::with('user')->latest()->paginate(6)
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');

    Route::get('/inbox', [MessageController::class, 'inbox'])->name('inbox');
    Route::post('/message/{user}', [MessageController::class, 'store'])->name('message.store');
    Route::get('/message/{user}', [MessageController::class, 'show'])->name('message.show');
    Route::delete('/message/{message}', [MessageController::class, 'destroy'])->name('message.destroy');
    Route::get('/messages/media/{userId}', [MessageController::class, 'getSharedMedia'])->name('messages.media');

    Route::post('/upload-file', [FileUploadController::class, 'upload'])->name('upload.file');

    Route::get('/users/status', [UserStatusController::class, 'getOnlineUsers']);
    Route::post('/users/status/update', [UserStatusController::class, 'updateStatus']);

    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
});

require __DIR__ . '/auth.php';
