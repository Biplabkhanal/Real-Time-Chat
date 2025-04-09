<?php

use App\Http\Controllers\BlockUserController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
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
    Route::delete('/conversation/{user}', [MessageController::class, 'destroyConversation'])->name('conversation.destroy');
    Route::get('/messages/media/{userId}', [MessageController::class, 'getSharedMedia'])->name('messages.media');
    Route::get('/users-with-conversations', [MessageController::class, 'getUsersWithConversations'])->name('users.with.conversations');
    Route::get('/conversation-stats/{user}', [MessageController::class, 'getConversationStats']);
    Route::get('/export-conversation/{user}', [MessageController::class, 'exportConversation'])->name('export.conversation');
    Route::get('/conversations/{user}/analytics', [MessageController::class, 'getConversationAnalytics']);

    Route::post('/upload-file', [FileUploadController::class, 'upload'])->name('upload.file');

    Route::get('/users/status', [UserStatusController::class, 'getOnlineUsers']);
    Route::post('/users/status/update', [UserStatusController::class, 'updateStatus']);

    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');

    Route::post('/block-user', [BlockUserController::class, 'blockUser']);
    Route::delete('/unblock-user/{user}', [BlockUserController::class, 'unblockUser']);
    Route::get('/block-status/{user}', [BlockUserController::class, 'checkBlockStatus']);
    Route::get('/blocked-users', [BlockUserController::class, 'getBlockedUsers']);

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/mark-read/{id}', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
});

require __DIR__ . '/auth.php';
