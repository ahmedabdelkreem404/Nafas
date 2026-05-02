<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $menVariants = [
            ['size_ml' => 30, 'retail_price' => 199],
            ['size_ml' => 50, 'retail_price' => 319],
            ['size_ml' => 100, 'retail_price' => 529],
        ];

        $womenVariants = [
            ['size_ml' => 30, 'retail_price' => 199],
            ['size_ml' => 50, 'retail_price' => 299],
            ['size_ml' => 100, 'retail_price' => 499],
        ];

        $products = [
            [
                'name_ar' => 'شرارة',
                'name_en' => 'Sharara',
                'code' => 'NFS-SHR-01',
                'gender' => 'Men',
                'story' => 'افتتاحية حارة ونظيفة تتحول إلى أثر مسكي داكن يناسب الحضور المسائي.',
                'personality' => 'fresh spicy musky dark',
                'marketing_line_ar' => 'أول رشة تلفت، وأثر يفضل.',
                'design_direction' => 'matte black + copper/amber',
                'scent_notes' => 'bergamot, pink pepper, amber woods, musk',
                'season' => 'all-season',
                'time_of_day' => 'evening',
                'projection_label' => 'strong',
                'longevity_label' => 'long',
                'strength_label' => 'eau de parfum',
                'status' => 'active',
                'variants' => $menVariants,
            ],
            [
                'name_ar' => 'مدار',
                'name_en' => 'Madar',
                'code' => 'NFS-002',
                'gender' => 'Men',
                'story' => 'خط فريش خشبي يومي يدور معك من أول المشوار لآخره.',
                'personality' => 'fresh woody sporty',
                'marketing_line_ar' => 'فريش يدور معاك طول اليوم.',
                'scent_notes' => 'grapefruit, cedar, vetiver, clean musk',
                'season' => 'summer',
                'time_of_day' => 'daily',
                'projection_label' => 'moderate',
                'longevity_label' => 'medium',
                'strength_label' => 'eau de parfum',
                'status' => 'active',
                'variants' => $menVariants,
            ],
            [
                'name_ar' => 'أثر',
                'name_en' => 'Athar',
                'code' => 'NFS-003',
                'gender' => 'Men',
                'story' => 'خشبية داكنة قوية بانطباع واضح ولمسة تبقى في الذاكرة.',
                'personality' => 'dark woody masculine',
                'marketing_line_ar' => 'يسبقك ويفضل بعدك.',
                'scent_notes' => 'incense, leather, patchouli, musk',
                'season' => 'winter',
                'time_of_day' => 'evening',
                'projection_label' => 'strong',
                'longevity_label' => 'long',
                'strength_label' => 'eau de parfum',
                'status' => 'active',
                'variants' => $menVariants,
            ],
            [
                'name_ar' => 'برق',
                'name_en' => 'Barq',
                'code' => 'NFS-004',
                'gender' => 'Men',
                'story' => 'نفحة قهوة منعشة مع شرارة قوية في الافتتاحية ولمعة نظيفة في الجفاف.',
                'personality' => 'fresh coffee bright',
                'marketing_line_ar' => 'قهوة فريش تلمع من أول رشة.',
                'scent_notes' => 'coffee, cardamom, lavender, amber',
                'season' => 'autumn',
                'time_of_day' => 'daily',
                'projection_label' => 'strong',
                'longevity_label' => 'medium-long',
                'strength_label' => 'eau de parfum',
                'status' => 'active',
                'variants' => $menVariants,
            ],
            [
                'name_ar' => 'ندى',
                'name_en' => 'Nada',
                'code' => 'NFS-005',
                'gender' => 'Women',
                'story' => 'فواكه ناعمة بلمسة نظيفة أنثوية مناسبة للهدايا والاستخدام اليومي.',
                'personality' => 'fresh fruity clean feminine',
                'marketing_line_ar' => 'فريش، نظيف، وأنثوي.',
                'scent_notes' => 'pear, white flowers, clean musk, soft woods',
                'season' => 'spring',
                'time_of_day' => 'daily',
                'projection_label' => 'soft-moderate',
                'longevity_label' => 'medium',
                'strength_label' => 'eau de parfum',
                'status' => 'active',
                'variants' => $womenVariants,
            ],
            [
                'name_ar' => 'غيمة',
                'name_en' => 'Ghayma',
                'code' => 'NFS-GHM-02',
                'gender' => 'Women',
                'story' => 'سحابة فاكهية مسكية حريرية بهدوء أنيق ولمسة ناعمة.',
                'personality' => 'soft fruity musky silky',
                'marketing_line_ar' => 'نعومة بتتعرف من غير صوت.',
                'design_direction' => 'off-white + rose gold',
                'scent_notes' => 'peach, iris, musk, vanilla veil',
                'season' => 'spring',
                'time_of_day' => 'evening',
                'projection_label' => 'moderate',
                'longevity_label' => 'medium-long',
                'strength_label' => 'eau de parfum',
                'status' => 'active',
                'variants' => $womenVariants,
            ],
            [
                'name_ar' => 'مجموعة التجربة',
                'name_en' => 'Discovery Set',
                'code' => 'NFS-DS-01',
                'gender' => 'Unisex',
                'story' => 'ست عينات صغيرة لاكتشاف شرارة ومدار وأثر وبرق وندى وغيمة قبل اختيار الزجاجة.',
                'personality' => 'six samples discovery set',
                'marketing_line_ar' => 'جرّب الستة واختار نفسك بهدوء.',
                'scent_notes' => 'Sharara, Madar, Athar, Barq, Nada, Ghayma',
                'season' => 'all-season',
                'time_of_day' => 'discovery',
                'projection_label' => 'varies',
                'longevity_label' => 'varies',
                'strength_label' => 'sample set',
                'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-DS-01-6S', 'size_ml' => 12, 'label' => '6 samples', 'bottle_type' => 'tester', 'packaging_type' => 'discovery set', 'retail_price' => 149, 'stock_quantity' => 50, 'low_stock_threshold' => 5, 'is_tester' => true],
                ],
            ],
            [
                'name_ar' => 'بوكس هدية رجالي',
                'name_en' => 'Men Gift Box',
                'code' => 'NFS-GB-MEN-01',
                'gender' => 'Men',
                'story' => 'هدية جاهزة لعطر رجالي من نفَس بتغليف أنيق واختيار واضح للمناسبات.',
                'personality' => 'gift box men elegant occasion',
                'marketing_line_ar' => 'اختيار أسهل لو الهدية لذوق رجالي هادئ وواضح.',
                'scent_notes' => 'gift packaging, Nafas perfume, occasion ready',
                'season' => 'all-season',
                'time_of_day' => 'gifting',
                'projection_label' => 'varies',
                'longevity_label' => 'varies',
                'strength_label' => 'gift box',
                'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-GB-MEN-01-50', 'size_ml' => 50, 'label' => 'Gift Box 50ml', 'bottle_type' => 'gift_box', 'packaging_type' => 'gift box', 'retail_price' => 699, 'stock_quantity' => 30, 'low_stock_threshold' => 5],
                ],
            ],
            [
                'name_ar' => 'بوكس هدية حريمي',
                'name_en' => 'Women Gift Box',
                'code' => 'NFS-GB-WOMEN-01',
                'gender' => 'Women',
                'story' => 'هدية جاهزة لعطر نسائي من نفَس بتغليف أنيق ولمسة مناسبة للمناسبات.',
                'personality' => 'gift box women elegant occasion',
                'marketing_line_ar' => 'هدية أنيقة وسهلة لو محتار تختار عطر مناسب.',
                'scent_notes' => 'gift packaging, Nafas perfume, occasion ready',
                'season' => 'all-season',
                'time_of_day' => 'gifting',
                'projection_label' => 'varies',
                'longevity_label' => 'varies',
                'strength_label' => 'gift box',
                'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-GB-WOMEN-01-50', 'size_ml' => 50, 'label' => 'Gift Box 50ml', 'bottle_type' => 'gift_box', 'packaging_type' => 'gift box', 'retail_price' => 649, 'stock_quantity' => 30, 'low_stock_threshold' => 5],
                ],
            ],
            [
                'name_ar' => 'بوكس التجربة',
                'name_en' => 'Discovery Gift Box',
                'code' => 'NFS-GB-DISC-01',
                'gender' => 'Unisex',
                'story' => 'مجموعة تجربة مغلفة كهدية لاكتشاف عطور نفَس الستة قبل اختيار الزجاجة.',
                'personality' => 'discovery gift box samples',
                'marketing_line_ar' => 'هدية خفيفة لاكتشاف الستة عطور بهدوء.',
                'scent_notes' => 'Sharara, Madar, Athar, Barq, Nada, Ghayma',
                'season' => 'all-season',
                'time_of_day' => 'discovery',
                'projection_label' => 'varies',
                'longevity_label' => 'varies',
                'strength_label' => 'sample gift box',
                'status' => 'active',
                'variants' => [
                    ['sku' => 'NFS-GB-DISC-01-6S', 'size_ml' => 12, 'label' => 'Discovery Gift Box', 'bottle_type' => 'gift_box', 'packaging_type' => 'gift box', 'retail_price' => 249, 'stock_quantity' => 30, 'low_stock_threshold' => 5, 'is_tester' => true],
                ],
            ],
            [
                'name_ar' => 'دفوة',
                'name_en' => 'Dafwa',
                'code' => 'NFS-DFW-03',
                'gender' => 'Unisex',
                'story' => 'تركيبة داخلية قيد التطوير وليست ضمن كتالوج الإطلاق.',
                'personality' => 'internal r&d',
                'marketing_line_ar' => 'قيد التطوير الداخلي.',
                'scent_notes' => 'internal only',
                'status' => 'hidden',
                'variants' => [],
            ],
            [
                'name_ar' => 'ظل',
                'name_en' => 'Zell',
                'code' => 'NFS-ZLL-04',
                'gender' => 'Unisex',
                'story' => 'تركيبة داخلية قيد التطوير وليست ضمن كتالوج الإطلاق.',
                'personality' => 'internal r&d',
                'marketing_line_ar' => 'قيد التطوير الداخلي.',
                'scent_notes' => 'internal only',
                'status' => 'hidden',
                'variants' => [],
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

            $activeSkus = [];

            foreach ($variants as $variant) {
                $variant += [
                    'sku' => sprintf('%s-%sML', $productData['code'], $variant['size_ml']),
                    'is_active' => true,
                    'stock_quantity' => 50,
                    'wholesale_price' => null,
                    'cost_price' => null,
                    'bottle_type' => 'spray',
                    'packaging_type' => 'retail box',
                    'low_stock_threshold' => 5,
                    'is_tester' => false,
                    'is_ball_oil_only' => false,
                    'oil_percentage' => 24,
                    'alcohol_percentage' => 76,
                ];
                $activeSkus[] = $variant['sku'];

                $product->variants()->updateOrCreate(
                    ['sku' => $variant['sku']],
                    $variant
                );
            }

            if ($activeSkus) {
                $product->variants()->whereNotIn('sku', $activeSkus)->update(['is_active' => false]);
            } else {
                $product->variants()->update(['is_active' => false]);
            }
        }
    }
}
