<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->text('story')->nullable()->after('gender');
            $table->string('season')->nullable()->after('scent_notes');
            $table->string('time_of_day')->nullable()->after('season');
            $table->string('projection_label')->nullable()->after('time_of_day');
            $table->string('longevity_label')->nullable()->after('projection_label');
            $table->string('strength_label')->nullable()->after('longevity_label');
            $table->string('seo_title')->nullable()->after('strength_label');
            $table->text('seo_description')->nullable()->after('seo_title');
            $table->string('og_image_url')->nullable()->after('seo_description');
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->string('label')->nullable()->after('size_ml');
            $table->decimal('low_stock_threshold', 10, 2)->default(5)->after('stock_quantity');
            $table->boolean('is_tester')->default(false)->after('is_active');
            $table->boolean('is_ball_oil_only')->default(false)->after('is_tester');
            $table->decimal('oil_percentage', 5, 2)->default(24)->after('is_ball_oil_only');
            $table->decimal('alcohol_percentage', 5, 2)->default(76)->after('oil_percentage');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_name')->nullable()->after('customer_id');
            $table->string('customer_phone')->nullable()->after('customer_name');
            $table->string('customer_email')->nullable()->after('customer_phone');
            $table->string('address')->nullable()->after('customer_email');
            $table->string('city')->nullable()->after('address');
            $table->string('governorate')->nullable()->after('city');
            $table->decimal('subtotal_amount', 10, 2)->default(0)->after('total_amount');
            $table->decimal('shipping_amount', 10, 2)->default(0)->after('discount_amount');
            $table->string('coupon_code')->nullable()->after('payment_method');
            $table->boolean('stock_deducted')->default(false)->after('coupon_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name',
                'customer_phone',
                'customer_email',
                'address',
                'city',
                'governorate',
                'subtotal_amount',
                'shipping_amount',
                'coupon_code',
                'stock_deducted',
            ]);
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn([
                'label',
                'low_stock_threshold',
                'is_tester',
                'is_ball_oil_only',
                'oil_percentage',
                'alcohol_percentage',
            ]);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'story',
                'season',
                'time_of_day',
                'projection_label',
                'longevity_label',
                'strength_label',
                'seo_title',
                'seo_description',
                'og_image_url',
            ]);
        });
    }
};
