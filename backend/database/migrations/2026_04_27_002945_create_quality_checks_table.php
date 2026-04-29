<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('quality_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('production_batch_id')->constrained('production_batches')->cascadeOnDelete();
            $table->string('clarity_test')->nullable();
            $table->string('sprayer_test')->nullable();
            $table->string('leak_test')->nullable();
            $table->string('scent_test')->nullable();
            $table->text('projection_notes')->nullable();
            $table->text('longevity_notes')->nullable();
            $table->string('approval_status')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('quality_checks'); }
};
