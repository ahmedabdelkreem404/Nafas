<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('slug')->unique();
            $table->string('name_ar');
            $table->string('name_en')->nullable();
            $table->string('gender'); // Men, Women, Unisex
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('personality')->nullable(); // e.g., Fresh spicy musky dark
            $table->string('marketing_line_ar')->nullable();
            $table->string('marketing_line_en')->nullable();
            $table->string('design_direction')->nullable();
            $table->text('scent_notes')->nullable(); // comma-separated or json
            $table->enum('status', ['draft', 'active', 'hidden'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('products');
    }
};
