<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('cost_material_per_bottle', 10, 2)->default(0)->after('og_image_url');
            $table->decimal('cost_packaging_per_bottle', 10, 2)->default(0)->after('cost_material_per_bottle');
            $table->decimal('cost_filling_per_bottle', 10, 2)->default(0)->after('cost_packaging_per_bottle');
        });

        Schema::table('formula_items', function (Blueprint $table) {
            $table->decimal('cost_per_gram', 10, 2)->default(0)->after('quantity_grams');
        });
    }

    public function down(): void
    {
        Schema::table('formula_items', function (Blueprint $table) {
            $table->dropColumn('cost_per_gram');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'cost_material_per_bottle',
                'cost_packaging_per_bottle',
                'cost_filling_per_bottle',
            ]);
        });
    }
};
