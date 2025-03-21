<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['recipient_id']);
            $table->dropForeign(['sender_id']);

            $table->foreign('recipient_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('sender_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['recipient_id']);
            $table->dropForeign(['sender_id']);

            $table->foreign('recipient_id')
                ->references('id')
                ->on('users');

            $table->foreign('sender_id')
                ->references('id')
                ->on('users');
        });
    }
};
