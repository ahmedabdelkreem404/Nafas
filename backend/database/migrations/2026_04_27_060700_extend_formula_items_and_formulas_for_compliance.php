<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('formulas', function (Blueprint $table) {
            $table->string('ifra_status')->nullable()->after('ball_oil_only');
            $table->string('sds_status')->nullable()->after('ifra_status');
            $table->string('supplier_name')->nullable()->after('sds_status');
            $table->string('supplier_reference')->nullable()->after('supplier_name');
            $table->string('supplier_batch_reference')->nullable()->after('supplier_reference');
            $table->boolean('is_admin_only')->default(true)->after('supplier_batch_reference');
        });

        Schema::table('formula_items', function (Blueprint $table) {
            $table->foreignId('ingredient_id')->nullable()->after('formula_id')->constrained()->nullOnDelete();
            $table->decimal('quantity_grams', 8, 2)->nullable()->after('quantity_ml');
            $table->decimal('percentage', 8, 2)->nullable()->after('quantity_grams');
            $table->text('internal_notes')->nullable()->after('percentage');
            $table->string('supplier_reference')->nullable()->after('internal_notes');
            $table->string('ifra_status')->nullable()->after('supplier_reference');
            $table->string('sds_status')->nullable()->after('ifra_status');
        });
    }

    public function down(): void
    {
        Schema::table('formula_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('ingredient_id');
            $table->dropColumn(['quantity_grams', 'percentage', 'internal_notes', 'supplier_reference', 'ifra_status', 'sds_status']);
        });

        Schema::table('formulas', function (Blueprint $table) {
            $table->dropColumn(['ifra_status', 'sds_status', 'supplier_name', 'supplier_reference', 'supplier_batch_reference', 'is_admin_only']);
        });
    }
};
