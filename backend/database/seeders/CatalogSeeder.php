<?php

namespace Database\Seeders;

use App\Models\Catalog;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalogs = [
            'nafas-signature' => [
                'name_ar' => 'عطور نفس الأساسية',
                'name_en' => 'Nafas Signature',
                'description_ar' => 'الكولكشن الرسمي الأساسي من نفس.',
                'description_en' => 'The official signature collection by Nafas.',
                'sort_order' => 10,
                'slugs' => ['sharara', 'madar', 'athar', 'barq', 'nada', 'ghayma'],
                'type' => 'nafas_signature',
            ],
            'special-blends' => [
                'name_ar' => 'تركيبات خاصة',
                'name_en' => 'Special Blends',
                'description_ar' => 'اختيارات عطرية إضافية قابلة للتحديث من لوحة التحكم.',
                'description_en' => 'Additional crafted perfume choices managed from the dashboard.',
                'sort_order' => 20,
                'slugs' => ['dafwa', 'zell'],
                'type' => 'special_blend',
            ],
            'testers' => [
                'name_ar' => 'عينات وتجربة',
                'name_en' => 'Testers and Discovery',
                'description_ar' => 'اختيارات تساعد العميل يجرب قبل الزجاجة الكاملة.',
                'description_en' => 'Formats that help customers try before a full bottle.',
                'sort_order' => 30,
                'slugs' => ['discovery-set'],
                'type' => 'discovery_set',
            ],
            'gifts' => [
                'name_ar' => 'هدايا وبوكسات',
                'name_en' => 'Gifts and Boxes',
                'description_ar' => 'بوكسات وهدايا نفس.',
                'description_en' => 'Nafas gift boxes.',
                'sort_order' => 40,
                'slugs' => ['men-gift-box', 'women-gift-box', 'discovery-gift-box'],
                'type' => 'gift_box',
            ],
        ];

        foreach ($catalogs as $slug => $catalogData) {
            $productSlugs = $catalogData['slugs'];
            $productType = $catalogData['type'];
            unset($catalogData['slugs'], $catalogData['type']);

            $catalog = Catalog::updateOrCreate(
                ['slug' => $slug],
                $catalogData + ['is_active' => true]
            );

            foreach ($productSlugs as $index => $productSlug) {
                $product = Product::where('slug', $productSlug)->first();
                if (! $product) {
                    continue;
                }

                $product->update([
                    'product_type' => $productType,
                    'public_label_ar' => $productType === 'nafas_signature' ? 'من كولكشن نفس' : ($productType === 'special_blend' ? 'تركيبة خاصة' : null),
                    'public_label_en' => $productType === 'nafas_signature' ? 'Nafas Signature' : ($productType === 'special_blend' ? 'Special Blend' : null),
                    'is_featured' => $productType === 'nafas_signature',
                    'show_on_home' => $productType === 'nafas_signature',
                    'scent_family' => $product->personality,
                    'tags' => array_values(array_filter(explode(' ', (string) $product->personality))),
                ]);

                $catalog->products()->syncWithoutDetaching([
                    $product->id => [
                        'sort_order' => ($index + 1) * 10,
                        'is_featured' => $productType === 'nafas_signature',
                    ],
                ]);
            }
        }
    }
}
