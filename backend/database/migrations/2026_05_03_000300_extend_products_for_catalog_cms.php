<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('product_type')->default('nafas_signature')->index();
            $table->string('public_label_ar')->nullable();
            $table->string('public_label_en')->nullable();
            $table->string('internal_reference')->nullable();
            $table->longText('internal_notes')->nullable();
            $table->string('hero_image_url')->nullable();
            $table->string('card_image_url')->nullable();
            $table->string('mobile_image_url')->nullable();
            $table->string('scent_family')->nullable()->index();
            $table->json('tags')->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('show_on_home')->default(false)->index();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'product_type',
                'public_label_ar',
                'public_label_en',
                'internal_reference',
                'internal_notes',
                'hero_image_url',
                'card_image_url',
                'mobile_image_url',
                'scent_family',
                'tags',
                'is_featured',
                'show_on_home',
            ]);
        });
    }
};
