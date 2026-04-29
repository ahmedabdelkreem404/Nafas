<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->after('customer_id')->constrained('reviews')->nullOnDelete();
            $table->string('author_name')->nullable()->after('parent_id');
            $table->text('body')->nullable()->after('title');
            $table->unsignedInteger('likes')->default(0)->after('body');
            $table->unsignedInteger('dislikes')->default(0)->after('likes');
            $table->string('status')->default('approved')->after('dislikes');
            $table->string('session_key')->nullable()->after('status');
        });

        Schema::create('review_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained()->cascadeOnDelete();
            $table->string('session_key');
            $table->string('type');
            $table->timestamps();
            $table->unique(['review_id', 'session_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_votes');

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropConstrainedForeignId('customer_id');
            $table->dropConstrainedForeignId('parent_id');
            $table->dropColumn(['author_name', 'body', 'likes', 'dislikes', 'status', 'session_key']);
        });
    }
};
