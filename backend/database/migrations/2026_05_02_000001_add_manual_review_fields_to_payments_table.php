<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('method')->nullable()->after('provider');
            $table->string('payer_phone')->nullable()->after('reference');
            $table->string('proof_image_path')->nullable()->after('payer_phone');
            $table->string('review_status')->nullable()->after('proof_image_path');
            $table->timestamp('reviewed_at')->nullable()->after('review_status');
            $table->foreignId('reviewed_by')->nullable()->after('reviewed_at')->constrained('users')->nullOnDelete();
            $table->text('admin_note')->nullable()->after('reviewed_by');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn([
                'method',
                'payer_phone',
                'proof_image_path',
                'review_status',
                'reviewed_at',
                'admin_note',
            ]);
        });
    }
};
