<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('show_in_shop')->default(true)->index()->after('show_on_home');
            $table->string('home_image_url')->nullable()->after('show_in_shop');
            $table->string('home_mobile_image_url')->nullable()->after('home_image_url');
            $table->string('home_link_url')->nullable()->after('home_mobile_image_url');
            $table->integer('home_sort_order')->default(0)->index()->after('home_link_url');
            $table->integer('shop_sort_order')->default(0)->index()->after('home_sort_order');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'show_in_shop',
                'home_image_url',
                'home_mobile_image_url',
                'home_link_url',
                'home_sort_order',
                'shop_sort_order',
            ]);
        });
    }
};
