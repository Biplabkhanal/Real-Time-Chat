<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckOfflineUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:check-offline';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and mark offline users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        User::where('is_online', true)
            ->where('last_seen_at', '<', Carbon::now()->subMinutes(2))
            ->update(['is_online' => false]);
    }
}
