<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_key')->unique();
            $table->string('type')->default('content');
            $table->string('title_ar')->nullable();
            $table->string('title_en')->nullable();
            $table->text('subtitle_ar')->nullable();
            $table->text('subtitle_en')->nullable();
            $table->longText('body_ar')->nullable();
            $table->longText('body_en')->nullable();
            $table->string('eyebrow_ar')->nullable();
            $table->string('eyebrow_en')->nullable();
            $table->string('cta_label_ar')->nullable();
            $table->string('cta_label_en')->nullable();
            $table->string('cta_url')->nullable();
            $table->string('secondary_cta_label_ar')->nullable();
            $table->string('secondary_cta_label_en')->nullable();
            $table->string('secondary_cta_url')->nullable();
            $table->string('image_url')->nullable();
            $table->string('mobile_image_url')->nullable();
            $table->string('video_url')->nullable();
            $table->string('accent_color')->nullable();
            $table->string('background_color')->nullable();
            $table->json('settings')->nullable();
            $table->integer('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('home_section_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('home_section_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title_ar')->nullable();
            $table->string('title_en')->nullable();
            $table->text('subtitle_ar')->nullable();
            $table->text('subtitle_en')->nullable();
            $table->longText('body_ar')->nullable();
            $table->longText('body_en')->nullable();
            $table->string('image_url')->nullable();
            $table->string('mobile_image_url')->nullable();
            $table->string('link_url')->nullable();
            $table->string('cta_label_ar')->nullable();
            $table->string('cta_label_en')->nullable();
            $table->string('accent_color')->nullable();
            $table->json('settings')->nullable();
            $table->integer('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_section_items');
        Schema::dropIfExists('home_sections');
    }
};
