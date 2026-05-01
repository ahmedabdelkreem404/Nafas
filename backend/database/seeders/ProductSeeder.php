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
            ['name_ar' => 'شرارة', 'name_en' => 'Sharara', 'code' => 'NFS-001', 'gender' => 'Men', 'story' => 'شرارة أولى حادة ثم مسك داكن يترك حضورا واضحا ومصقولا.', 'personality' => 'fresh spicy dark musky', 'marketing_line_ar' => 'العطر الرجالي الرئيسي للإطلاق.', 'marketing_line_en' => 'The main approved men launch scent.', 'design_direction' => 'matte black with warm copper accents', 'scent_notes' => 'cool citrus, clean spice, dark woods, musk', 'season' => 'all-season', 'time_of_day' => 'evening', 'projection_label' => 'clear controlled', 'longevity_label' => 'realistically long', 'strength_label' => '24% spray concentration', 'status' => 'active', 'variants' => [
                ['sku' => 'NFS-001-30ML', 'size_ml' => 30, 'label' => '30ml Retail', 'bottle_type' => 'spray', 'retail_price' => 199, 'stock_quantity' => 50],
                ['sku' => 'NFS-001-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'retail_price' => 319, 'stock_quantity' => 50],
                ['sku' => 'NFS-001-100ML', 'size_ml' => 100, 'label' => '100ml Retail', 'bottle_type' => 'spray', 'retail_price' => 529, 'stock_quantity' => 50],
            ]],
            ['name_ar' => 'مدار', 'name_en' => 'Madar', 'code' => 'NFS-002', 'gender' => 'Men', 'story' => 'فريش خشبي رياضي للاستخدام اليومي والعمل.', 'personality' => 'fresh woody sporty daily', 'marketing_line_ar' => 'فريش يدور معاك طول اليوم.', 'marketing_line_en' => 'A fresh sporty scent for daily movement.', 'design_direction' => 'clean black with silver sporty detailing', 'scent_notes' => 'grapefruit, lavender, clean woods, cool musk', 'season' => 'spring summer', 'time_of_day' => 'daily', 'projection_label' => 'quiet noticeable', 'longevity_label' => 'balanced medium', 'strength_label' => '24% spray concentration', 'status' => 'active', 'variants' => [
                ['sku' => 'NFS-002-30ML', 'size_ml' => 30, 'label' => '30ml Retail', 'bottle_type' => 'spray', 'retail_price' => 199, 'stock_quantity' => 50],
                ['sku' => 'NFS-002-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'retail_price' => 319, 'stock_quantity' => 50],
                ['sku' => 'NFS-002-100ML', 'size_ml' => 100, 'label' => '100ml Retail', 'bottle_type' => 'spray', 'retail_price' => 529, 'stock_quantity' => 50],
            ]],
            ['name_ar' => 'أثر', 'name_en' => 'Athar', 'code' => 'NFS-003', 'gender' => 'Men', 'story' => 'داكن فريش خشبي، قوي وواضح بانطباع طويل.', 'personality' => 'dark fresh woody strong impression', 'marketing_line_ar' => 'يسبقك بهدوء ويفضل بعدك.', 'marketing_line_en' => 'A darker woody trail for a lasting impression.', 'design_direction' => 'charcoal black with quiet gold', 'scent_notes' => 'dark fresh opening, woods, soft leather nuance, musk', 'season' => 'autumn winter', 'time_of_day' => 'evening', 'projection_label' => 'strong not harsh', 'longevity_label' => 'long and clear', 'strength_label' => '24% spray concentration', 'status' => 'active', 'variants' => [
                ['sku' => 'NFS-003-30ML', 'size_ml' => 30, 'label' => '30ml Retail', 'bottle_type' => 'spray', 'retail_price' => 199, 'stock_quantity' => 50],
                ['sku' => 'NFS-003-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'retail_price' => 319, 'stock_quantity' => 50],
                ['sku' => 'NFS-003-100ML', 'size_ml' => 100, 'label' => '100ml Retail', 'bottle_type' => 'spray', 'retail_price' => 529, 'stock_quantity' => 50],
            ]],
            ['name_ar' => 'برق', 'name_en' => 'Barq', 'code' => 'NFS-004', 'gender' => 'Men', 'story' => 'قهوة فريش حارة تلمع من أول رشة ثم تهدأ فوق قاعدة دافئة.', 'personality' => 'fresh spicy coffee', 'marketing_line_ar' => 'قهوة فريش تلمع من أول رشة.', 'marketing_line_en' => 'Fresh spicy coffee from the first spray.', 'design_direction' => 'gloss black with copper coffee cues', 'scent_notes' => 'light coffee, cardamom, lavender, amber', 'season' => 'autumn mild weather', 'time_of_day' => 'evening', 'projection_label' => 'clear opening then balanced', 'longevity_label' => 'medium to long', 'strength_label' => '24% spray concentration', 'status' => 'active', 'variants' => [
                ['sku' => 'NFS-004-30ML', 'size_ml' => 30, 'label' => '30ml Retail', 'bottle_type' => 'spray', 'retail_price' => 199, 'stock_quantity' => 50],
                ['sku' => 'NFS-004-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'retail_price' => 319, 'stock_quantity' => 50],
                ['sku' => 'NFS-004-100ML', 'size_ml' => 100, 'label' => '100ml Retail', 'bottle_type' => 'spray', 'retail_price' => 529, 'stock_quantity' => 50],
            ]],
            ['name_ar' => 'ندى', 'name_en' => 'Nada', 'code' => 'NFS-005', 'gender' => 'Women', 'story' => 'فريش فاكهي نظيف وأنثوي للاستخدام اليومي والهدايا الهادئة.', 'personality' => 'fresh fruity clean feminine', 'marketing_line_ar' => 'فريش، نظيف، وأنثوي.', 'marketing_line_en' => 'Fresh, clean, and feminine.', 'design_direction' => 'soft white with rose gold', 'scent_notes' => 'soft fruit, white flowers, clean musk, light woods', 'season' => 'spring summer', 'time_of_day' => 'daily', 'projection_label' => 'soft likable', 'longevity_label' => 'soft medium', 'strength_label' => '24% spray concentration', 'status' => 'active', 'variants' => [
                ['sku' => 'NFS-005-30ML', 'size_ml' => 30, 'label' => '30ml Retail', 'bottle_type' => 'spray', 'retail_price' => 199, 'stock_quantity' => 50],
                ['sku' => 'NFS-005-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'retail_price' => 299, 'stock_quantity' => 50],
                ['sku' => 'NFS-005-100ML', 'size_ml' => 100, 'label' => '100ml Retail', 'bottle_type' => 'spray', 'retail_price' => 499, 'stock_quantity' => 50],
            ]],
            ['name_ar' => 'غيمة', 'name_en' => 'Ghayma', 'code' => 'NFS-006', 'gender' => 'Women', 'story' => 'ناعمة فاكهية مسكية، مناسبة للهدايا والاختيار المطمئن.', 'personality' => 'soft fruity musky gift', 'marketing_line_ar' => 'هدية ناعمة وسهلة الحب.', 'marketing_line_en' => 'A soft, easy-to-love gift scent.', 'design_direction' => 'off-white with quiet rose accents', 'scent_notes' => 'soft peach, light florals, musk, transparent vanilla', 'season' => 'all-season', 'time_of_day' => 'gift daily', 'projection_label' => 'close silky', 'longevity_label' => 'comfortable medium', 'strength_label' => '24% spray concentration; oil ball exception', 'status' => 'active', 'variants' => [
                ['sku' => 'NFS-006-30ML', 'size_ml' => 30, 'label' => '30ml Retail', 'bottle_type' => 'spray', 'retail_price' => 199, 'stock_quantity' => 50],
                ['sku' => 'NFS-006-50ML', 'size_ml' => 50, 'label' => '50ml Retail', 'bottle_type' => 'spray', 'retail_price' => 299, 'stock_quantity' => 50],
                ['sku' => 'NFS-006-100ML', 'size_ml' => 100, 'label' => '100ml Retail', 'bottle_type' => 'spray', 'retail_price' => 499, 'stock_quantity' => 50],
            ]],
            ['name_ar' => 'مجموعة التجربة', 'name_en' => 'Discovery Set', 'code' => 'NFS-DS-001', 'gender' => 'Unisex', 'story' => 'ست عينات صغيرة من كولكشن نفس لتجربة الرائحة قبل اختيار الزجاجة.', 'personality' => 'six-scent discovery samples', 'marketing_line_ar' => 'جرّب قبل ما تختار.', 'marketing_line_en' => 'Try the collection before choosing a bottle.', 'design_direction' => 'warm cream tester sleeve with quiet gold detailing', 'scent_notes' => 'Sharara, Madar, Athar, Barq, Nada, Ghayma', 'season' => 'all-season', 'time_of_day' => 'discovery', 'projection_label' => 'varies by scent', 'longevity_label' => 'varies by scent', 'strength_label' => 'tester discovery format', 'status' => 'active', 'variants' => [
                ['sku' => 'NFS-DS-001', 'size_ml' => 18, 'label' => 'Discovery Set (6x3ml)', 'bottle_type' => 'tester-set', 'retail_price' => 149, 'stock_quantity' => 100],
            ]],
            ['name_ar' => 'دفوة', 'name_en' => 'Dafwa', 'code' => 'NFS-RD-001', 'gender' => 'Unisex', 'story' => 'R&D scent, not part of the public launch collection.', 'personality' => 'research and development', 'marketing_line_ar' => 'غير متاح في كولكشن الإطلاق العام.', 'marketing_line_en' => 'Not available in the public launch collection.', 'design_direction' => 'R&D', 'scent_notes' => 'internal', 'season' => 'R&D', 'time_of_day' => 'R&D', 'projection_label' => 'internal', 'longevity_label' => 'internal', 'strength_label' => 'internal', 'status' => 'hidden', 'variants' => []],
            ['name_ar' => 'ظل', 'name_en' => 'Zell', 'code' => 'NFS-RD-002', 'gender' => 'Unisex', 'story' => 'R&D scent, not part of the public launch collection.', 'personality' => 'research and development', 'marketing_line_ar' => 'غير متاح في كولكشن الإطلاق العام.', 'marketing_line_en' => 'Not available in the public launch collection.', 'design_direction' => 'R&D', 'scent_notes' => 'internal', 'season' => 'R&D', 'time_of_day' => 'R&D', 'projection_label' => 'internal', 'longevity_label' => 'internal', 'strength_label' => 'internal', 'status' => 'hidden', 'variants' => []],
        ];

        foreach ($products as $productData) {
            $variants = $productData['variants'];
            unset($productData['variants']);
            $productData['slug'] = Str::slug($productData['name_en']);
            $product = Product::updateOrCreate(['slug' => $productData['slug']], $productData);

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
                $product->variants()->updateOrCreate(['sku' => $variant['sku']], $variant);
            }
        }
    }
}
