<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('production_batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_code')->unique();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity_produced');
            $table->date('mix_date')->nullable();
            $table->date('maturation_start_date')->nullable();
            $table->date('allowed_sale_date')->nullable();
            $table->string('qc_status')->default('drafted'); // drafted, mixed, maturing, qc_pending, approved, rejected
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('production_batches'); }
};
