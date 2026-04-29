<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('formulas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->text('internal_notes')->nullable();
            $table->integer('oil_percentage')->default(24);
            $table->integer('alcohol_percentage')->default(76);
            $table->boolean('ball_oil_only')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('formulas'); }
};
