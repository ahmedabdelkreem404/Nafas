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
            ['key' => 'hero_title', 'value' => 'كل نفس... بيحكي عنك', 'type' => 'string'],
            ['key' => 'hero_subtitle', 'value' => 'نفس تجربة عطرية مصممة ومتزنة ومتعّتقة، وليست مجرد زيت عطر.', 'type' => 'string'],
            ['key' => 'hero_video', 'value' => 'https://www.w3schools.com/html/mov_bbb.mp4', 'type' => 'string'],
            ['key' => 'hero_fallback_image', 'value' => 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop', 'type' => 'image'],
            ['key' => 'whatsapp_number', 'value' => '+201000000000', 'type' => 'string'],
        ] as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }

        foreach ([
            ['slug' => 'faq', 'title' => 'FAQ', 'content' => "Discovery Set\nعينات 3ml / 5ml / 10ml لتجربة الرائحة قبل الزجاجة الكاملة.\n\nاختيار العطر\nشرارة ومدار لليومي الرجالي، أثر وبرق للغامق القوي، ندى للحريمي اليومي، وغيمة للهدايا الناعمة.", 'is_active' => true],
            ['slug' => 'privacy-policy', 'title' => 'Privacy Policy', 'content' => 'نستخدم بيانات الطلب للتأكيد والتوصيل والدعم فقط.', 'is_active' => true],
            ['slug' => 'return-policy', 'title' => 'Return Policy', 'content' => 'يمكن مراجعة الطلب قبل التجهيز النهائي حسب حالة الطلب. سياسة الاستبدال النهائية تحتاج اعتمادا تشغيليا وقانونيا.', 'is_active' => true],
            ['slug' => 'terms', 'title' => 'Terms and Product Warnings', 'content' => 'للاستخدام الخارجي فقط. يحفظ بعيدا عن الأطفال والحرارة واللهب. ينصح باختبار رقعة للبشرة الحساسة. لا نستخدم ادعاءات مبالغ فيها مثل 48 ساعة أو 100% آمن.', 'is_active' => true],
            ['slug' => 'about', 'title' => 'About Nafas', 'content' => 'نفس معناها أثر وروح وحضور. براند من Inolty لعطور محلية عالية الجودة، كل عطر فيه له اسم وقصة وباتش وتعتيق وفحص.', 'is_active' => true],
            ['slug' => 'quality', 'title' => 'Quality', 'content' => 'بخاخات نفس بتركيز 24% زيت و76% كحول. التعتيق 21-30 يوم حسب الرائحة. كل دفعة لها سجل باتش وفحص وضوح ورشاش. لا يتم كشف نسب التركيبات أو الحسابات الداخلية علنا.', 'is_active' => true],
        ] as $page) {
            Page::updateOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
