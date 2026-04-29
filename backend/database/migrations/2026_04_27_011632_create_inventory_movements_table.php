<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // addition, deduction
            $table->integer('quantity');
            $table->string('reason'); // e.g., "order_placed", "order_cancelled", "manual_adjustment", "batch_approved"
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('production_batch_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('inventory_movements'); }
};
