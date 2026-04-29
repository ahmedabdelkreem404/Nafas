<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->string('google_id')->nullable()->unique()->after('email');
            $table->string('profile_picture')->nullable()->after('google_id');
            $table->timestamp('email_verified_at')->nullable()->after('profile_picture');
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'profile_picture', 'email_verified_at']);
        });
    }
};
