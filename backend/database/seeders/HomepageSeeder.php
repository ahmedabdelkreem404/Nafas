<?php

namespace Database\Seeders;

use App\Models\HomeSection;
use App\Models\Product;
use Illuminate\Database\Seeder;

class HomepageSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            ['section_key' => 'ribbon', 'type' => 'ribbon', 'title_ar' => 'كل نفس... بيحكي عنك', 'title_en' => 'Every breath says something about you', 'sort_order' => 10],
            ['section_key' => 'ritual', 'type' => 'ritual', 'title_ar' => 'طقس الدخول إلى نفس', 'title_en' => 'The Nafas ritual', 'sort_order' => 20],
            ['section_key' => 'highlights', 'type' => 'highlights', 'title_ar' => 'تفاصيل هادئة تختصر التجربة', 'title_en' => 'Quiet details that shape the experience', 'sort_order' => 30],
            ['section_key' => 'emotional', 'type' => 'emotional', 'title_ar' => 'العطر قبل السعر', 'title_en' => 'Scent before price', 'sort_order' => 40],
            ['section_key' => 'product-viewer', 'type' => 'product_viewer', 'title_ar' => 'كولكشن نفس الأساسي', 'title_en' => 'Nafas Signature Collection', 'subtitle_ar' => 'ست عطور لها شخصية ومزاج ووقت.', 'subtitle_en' => 'Six scents with personality, mood, and rhythm.', 'sort_order' => 50],
            ['section_key' => 'story-chapters', 'type' => 'story_chapters', 'title_ar' => 'حكاية كل عطر', 'title_en' => 'A chapter for every scent', 'sort_order' => 60],
            ['section_key' => 'senses', 'type' => 'senses', 'title_ar' => 'إحساس العطر على الشاشة', 'title_en' => 'A sensory digital layer', 'sort_order' => 70],
            ['section_key' => 'tester-to-bottle', 'type' => 'tester_flow', 'title_ar' => 'من التجربة للزجاجة', 'title_en' => 'From tester to bottle', 'sort_order' => 80],
            ['section_key' => 'hero', 'type' => 'hero', 'title_ar' => 'كل نفس... بيحكي عنك', 'title_en' => 'Every breath says something about you', 'cta_label_ar' => 'تسوق الكولكشن', 'cta_label_en' => 'Shop the collection', 'cta_url' => '/shop', 'sort_order' => 90],
            ['section_key' => 'better-together', 'type' => 'bundle', 'title_ar' => 'تجربة أوسع بهدوء', 'title_en' => 'A wider experience, calmly', 'sort_order' => 100],
            ['section_key' => 'scent-selector', 'type' => 'selector', 'title_ar' => 'اختار حسب إحساسك', 'title_en' => 'Choose by feeling', 'sort_order' => 110],
            ['section_key' => 'trust', 'type' => 'trust', 'title_ar' => 'ثقة بدون مبالغة', 'title_en' => 'Trust without exaggeration', 'sort_order' => 120],
            ['section_key' => 'comparison', 'type' => 'comparison', 'title_ar' => 'قارن الروائح بهدوء', 'title_en' => 'Compare the scents calmly', 'sort_order' => 130],
            ['section_key' => 'keep-exploring', 'type' => 'explore', 'title_ar' => 'كمل استكشاف عالم نفس', 'title_en' => 'Keep exploring Nafas', 'sort_order' => 140],
            ['section_key' => 'final-cta', 'type' => 'final_cta', 'title_ar' => 'اختار نفسك من ريحتك', 'title_en' => 'Choose yourself through scent', 'cta_label_ar' => 'ابدأ التسوق', 'cta_label_en' => 'Start shopping', 'cta_url' => '/shop', 'sort_order' => 150],
        ];

        foreach ($sections as $sectionData) {
            HomeSection::updateOrCreate(
                ['section_key' => $sectionData['section_key']],
                $sectionData + ['is_active' => true]
            );
        }

        $signatureSlugs = ['sharara', 'ghayma', 'athar', 'barq', 'nada', 'madar'];
        $sectionKeysWithProducts = ['ritual', 'product-viewer', 'hero', 'comparison'];

        foreach ($sectionKeysWithProducts as $sectionKey) {
            $section = HomeSection::where('section_key', $sectionKey)->first();
            if (! $section) {
                continue;
            }

            foreach ($signatureSlugs as $index => $slug) {
                $product = Product::where('slug', $slug)->first();
                if (! $product) {
                    continue;
                }

                $section->items()->updateOrCreate(
                    ['product_id' => $product->id],
                    [
                        'title_ar' => $product->name_ar,
                        'title_en' => $product->name_en,
                        'subtitle_ar' => $product->marketing_line_ar,
                        'subtitle_en' => $product->marketing_line_en,
                        'link_url' => '/products/'.$product->slug,
                        'accent_color' => $product->design_direction,
                        'sort_order' => ($index + 1) * 10,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
