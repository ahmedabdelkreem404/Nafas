<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name_ar' => 'شرارة',
                'name_en' => 'Sharara',
                'code' => 'NFS-SHR-01',
                'gender' => 'Men',
                'story' => 'افتتاحية منعشة تتدرج إلى قلب حار ولمسة مسكية داكنة تناسب حضور المساء.',
                'personality' => 'fresh spicy musky dark',
                'marketing_line_ar' => 'أول رشة تلفت، وأثر يفضل.',
                'design_direction' => 'matte black + copper/amber',
                'scent_notes' => 'bergamot, pink pepper, amber woods, musk',
                'season' => 'all-season',
                'time_of_day' => 'evening',
                'projection_label' => 'strong',
                'longevity_label' => 'long-lasting',
                'strength_label' => 'eau de parfum',
                'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-SHR-01-3ML', 'size_ml' => 3, 'label' => '3ml Tester', 'bottle_type' => 'tester', 'packaging_type' => 'sample card', 'retail_price' => 149, 'wholesale_price' => 110, 'cost_price' => 62, 'stock_quantity' => 40, 'low_stock_threshold' => 5, 'is_tester' => true],
                    ['sku' => 'NFS-SHR-01-25ML', 'size_ml' => 25, 'label' => '25ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'luxury box', 'retail_price' => 899, 'wholesale_price' => 730, 'cost_price' => 340, 'stock_quantity' => 30, 'low_stock_threshold' => 4],
                    ['sku' => 'NFS-SHR-01-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'luxury box', 'retail_price' => 1499, 'wholesale_price' => 1210, 'cost_price' => 590, 'stock_quantity' => 25, 'low_stock_threshold' => 4],
                    ['sku' => 'NFS-SHR-01-100ML', 'size_ml' => 100, 'label' => '100ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'luxury box', 'retail_price' => 2499, 'wholesale_price' => 2050, 'cost_price' => 990, 'stock_quantity' => 15, 'low_stock_threshold' => 3],
                ],
            ],
            [
                'name_ar' => 'مدار', 'name_en' => 'Madar', 'code' => 'NFS-002', 'gender' => 'Men',
                'story' => 'خط فريش خشبي رياضي يومي يشتغل من أول المشوار لآخره.',
                'personality' => 'fresh woody sporty', 'marketing_line_ar' => 'فريش يدور معاك طول اليوم.',
                'scent_notes' => 'grapefruit, cedar, vetiver, clean musk', 'season' => 'summer', 'time_of_day' => 'daily',
                'projection_label' => 'moderate', 'longevity_label' => 'medium', 'strength_label' => 'eau de parfum', 'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-002-10ML', 'size_ml' => 10, 'label' => '10ml Tester', 'bottle_type' => 'tester', 'packaging_type' => 'tube', 'retail_price' => 229, 'wholesale_price' => 170, 'cost_price' => 88, 'stock_quantity' => 35, 'low_stock_threshold' => 5, 'is_tester' => true],
                    ['sku' => 'NFS-002-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'retail box', 'retail_price' => 1399, 'wholesale_price' => 1130, 'cost_price' => 545, 'stock_quantity' => 18, 'low_stock_threshold' => 4],
                ],
            ],
            [
                'name_ar' => 'أثر', 'name_en' => 'Athar', 'code' => 'NFS-003', 'gender' => 'Men',
                'story' => 'خشبية داكنة قوية بانطباع رجولي واضح ولمسة تدوم في الذاكرة.',
                'personality' => 'dark masculine polished trail', 'marketing_line_ar' => 'يسبقك ويفضل بعدك.',
                'scent_notes' => 'incense, leather, patchouli, musk', 'season' => 'winter', 'time_of_day' => 'evening',
                'projection_label' => 'strong', 'longevity_label' => 'long-lasting', 'strength_label' => 'eau de parfum', 'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-003-25ML', 'size_ml' => 25, 'label' => '25ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'retail box', 'retail_price' => 959, 'wholesale_price' => 780, 'cost_price' => 360, 'stock_quantity' => 24, 'low_stock_threshold' => 4],
                    ['sku' => 'NFS-003-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'retail box', 'retail_price' => 1599, 'wholesale_price' => 1290, 'cost_price' => 640, 'stock_quantity' => 16, 'low_stock_threshold' => 4],
                ],
            ],
            [
                'name_ar' => 'برق', 'name_en' => 'Barq', 'code' => 'NFS-004', 'gender' => 'Men',
                'story' => 'نفحة قهوة منعشة مع شرارة قوية في الافتتاحية ولمعة نظيفة في الجفاف.',
                'personality' => 'fresh coffee strong projection', 'marketing_line_ar' => 'قهوة فريش تلمع من أول رشة.',
                'scent_notes' => 'coffee, cardamom, lavender, amber', 'season' => 'autumn', 'time_of_day' => 'daily',
                'projection_label' => 'strong', 'longevity_label' => 'medium-long', 'strength_label' => 'eau de parfum', 'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-004-5ML', 'size_ml' => 5, 'label' => '5ml Tester', 'bottle_type' => 'tester', 'packaging_type' => 'sample tube', 'retail_price' => 179, 'wholesale_price' => 130, 'cost_price' => 74, 'stock_quantity' => 50, 'low_stock_threshold' => 8, 'is_tester' => true],
                    ['sku' => 'NFS-004-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'retail box', 'retail_price' => 1549, 'wholesale_price' => 1250, 'cost_price' => 605, 'stock_quantity' => 20, 'low_stock_threshold' => 4],
                ],
            ],
            [
                'name_ar' => 'ندى', 'name_en' => 'Nada', 'code' => 'NFS-005', 'gender' => 'Women',
                'story' => 'فواكه ناعمة بلمسة نظيفة أنثوية مناسبة للهدايا والاستخدام اليومي.',
                'personality' => 'fresh fruity clean feminine', 'marketing_line_ar' => 'فريش، نضيف، وأنثوي.',
                'scent_notes' => 'pear, white flowers, clean musk, soft woods', 'season' => 'spring', 'time_of_day' => 'daily',
                'projection_label' => 'soft-moderate', 'longevity_label' => 'medium', 'strength_label' => 'eau de parfum', 'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-005-30ML', 'size_ml' => 30, 'label' => '30ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'retail box', 'retail_price' => 1099, 'wholesale_price' => 900, 'cost_price' => 420, 'stock_quantity' => 20, 'low_stock_threshold' => 4],
                    ['sku' => 'NFS-005-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'retail box', 'retail_price' => 1450, 'wholesale_price' => 1180, 'cost_price' => 560, 'stock_quantity' => 18, 'low_stock_threshold' => 4],
                ],
            ],
            [
                'name_ar' => 'غيمة', 'name_en' => 'Ghayma', 'code' => 'NFS-GHM-02', 'gender' => 'Women',
                'story' => 'سحابة فاكهية مسكية حريرية بهدوء أنيق ولمسة ناعمة.',
                'personality' => 'soft fruity musky silky', 'marketing_line_ar' => 'نعومة بتتعرف من غير صوت.',
                'design_direction' => 'off-white + rose gold',
                'scent_notes' => 'peach, iris, musk, vanilla veil', 'season' => 'spring', 'time_of_day' => 'evening',
                'projection_label' => 'moderate', 'longevity_label' => 'medium-long', 'strength_label' => 'eau de parfum', 'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-GHM-02-4P5ML', 'size_ml' => 4, 'label' => '4.5ml Ball Oil', 'bottle_type' => 'ball', 'packaging_type' => 'pouch', 'retail_price' => 299, 'wholesale_price' => 220, 'cost_price' => 115, 'stock_quantity' => 30, 'low_stock_threshold' => 5, 'is_ball_oil_only' => true, 'oil_percentage' => 100, 'alcohol_percentage' => 0],
                    ['sku' => 'NFS-GHM-02-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'luxury box', 'retail_price' => 1599, 'wholesale_price' => 1290, 'cost_price' => 630, 'stock_quantity' => 14, 'low_stock_threshold' => 3],
                ],
            ],
            [
                'name_ar' => 'دفوة', 'name_en' => 'Dafwa', 'code' => 'NFS-DFW-03', 'gender' => 'Unisex',
                'story' => 'قهوة دافئة بطابع حلو شرقي تقيل لكنه أنيق ومناسب للمساء.',
                'personality' => 'warm coffee sweet oriental', 'marketing_line_ar' => 'قهوة دافية… وحضور مايتنسيش.',
                'design_direction' => 'mocha + warm gold',
                'scent_notes' => 'coffee, caramel, tonka, amber', 'season' => 'winter', 'time_of_day' => 'evening',
                'projection_label' => 'strong', 'longevity_label' => 'long-lasting', 'strength_label' => 'eau de parfum', 'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-DFW-03-25ML', 'size_ml' => 25, 'label' => '25ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'retail box', 'retail_price' => 929, 'wholesale_price' => 760, 'cost_price' => 355, 'stock_quantity' => 22, 'low_stock_threshold' => 4],
                    ['sku' => 'NFS-DFW-03-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'retail box', 'retail_price' => 1500, 'wholesale_price' => 1220, 'cost_price' => 600, 'stock_quantity' => 18, 'low_stock_threshold' => 4],
                ],
            ],
            [
                'name_ar' => 'ظلّ', 'name_en' => 'Zell', 'code' => 'NFS-ZLL-04', 'gender' => 'Unisex',
                'story' => 'خشبي شرقي هادئ بعمق واضح وحضور يبان بعد دقائق.',
                'personality' => 'dark woody calm oriental', 'marketing_line_ar' => 'هادئ… لكنه بيسيب أثر.',
                'design_direction' => 'charcoal black + silver',
                'scent_notes' => 'oud accord, cedar, incense, musk', 'season' => 'autumn', 'time_of_day' => 'evening',
                'projection_label' => 'moderate-strong', 'longevity_label' => 'long-lasting', 'strength_label' => 'eau de parfum', 'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-ZLL-04-10ML', 'size_ml' => 10, 'label' => '10ml Tester', 'bottle_type' => 'tester', 'packaging_type' => 'sample tube', 'retail_price' => 239, 'wholesale_price' => 180, 'cost_price' => 90, 'stock_quantity' => 30, 'low_stock_threshold' => 5, 'is_tester' => true],
                    ['sku' => 'NFS-ZLL-04-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'packaging_type' => 'retail box', 'retail_price' => 1500, 'wholesale_price' => 1210, 'cost_price' => 590, 'stock_quantity' => 17, 'low_stock_threshold' => 4],
                ],
            ],
        ];

        foreach ($products as $productData) {
            $variants = $productData['variants'];
            unset($productData['variants']);

            $productData['slug'] = Str::slug($productData['name_en']);
            $product = Product::updateOrCreate(
                ['slug' => $productData['slug']],
                $productData
            );

            foreach ($variants as $variant) {
                $variant += [
                    'is_active' => true,
                    'wholesale_price' => null,
                    'cost_price' => null,
                    'bottle_type' => null,
                    'packaging_type' => null,
                    'low_stock_threshold' => 5,
                    'is_tester' => false,
                    'is_ball_oil_only' => false,
                    'oil_percentage' => 24,
                    'alcohol_percentage' => 76,
                ];

                $product->variants()->updateOrCreate(
                    ['sku' => $variant['sku']],
                    $variant
                );
            }
        }
    }
}
