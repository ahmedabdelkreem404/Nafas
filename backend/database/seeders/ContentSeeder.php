<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['key' => 'hero_title', 'value' => 'نفَس... أول رشة تكمل حضورك', 'type' => 'string'],
            ['key' => 'hero_subtitle', 'value' => 'تجربة عطرية سينمائية بهوية عربية فاخرة.', 'type' => 'string'],
            ['key' => 'hero_video', 'value' => 'https://www.w3schools.com/html/mov_bbb.mp4', 'type' => 'string'],
            ['key' => 'hero_fallback_image', 'value' => 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop', 'type' => 'image'],
            ['key' => 'whatsapp_number', 'value' => '+201000000000', 'type' => 'string'],
        ] as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }

        foreach ([
            ['slug' => 'faq', 'title' => 'FAQ', 'content' => 'الأسئلة الشائعة الخاصة بالشحن، التسترز، وسياسة الطلب.', 'is_active' => true],
            ['slug' => 'privacy-policy', 'title' => 'Privacy Policy', 'content' => 'سياسة الخصوصية الخاصة ببيانات العملاء والطلبات.', 'is_active' => true],
            ['slug' => 'return-policy', 'title' => 'Return Policy', 'content' => 'سياسة الاسترجاع والاستبدال حسب حالة العبوة والطلب.', 'is_active' => true],
            ['slug' => 'terms', 'title' => 'Terms', 'content' => 'الشروط والأحكام الخاصة باستخدام المنصة والشراء.', 'is_active' => true],
            ['slug' => 'about', 'title' => 'About Nafas', 'content' => 'نفَس علامة عطور فاخرة من Inolty تجمع بين الحضور، الحكاية، والانطباع.', 'is_active' => true],
            ['slug' => 'quality', 'title' => 'Quality', 'content' => 'عمليات مراجعة الجودة تشمل الوضوح، التسريب، الرش، والانطباع العطري.', 'is_active' => true],
        ] as $page) {
            Page::updateOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
