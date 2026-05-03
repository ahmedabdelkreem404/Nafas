<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'brand_name_ar' => ['value' => 'دار نفَس', 'type' => 'string'],
            'brand_name_en' => ['value' => 'Maison Nafas', 'type' => 'string'],
            'brand_subtitle_ar' => ['value' => 'دار عطرية عربية', 'type' => 'string'],
            'brand_subtitle_en' => ['value' => 'Arabic perfume house', 'type' => 'string'],
            'footer_title_ar' => ['value' => 'دار نفَس', 'type' => 'string'],
            'footer_title_en' => ['value' => 'Maison Nafas', 'type' => 'string'],
            'footer_brand_ar' => ['value' => 'دار عطرية عربية تبدأ بالتجربة الهادئة: تستر أولاً، اختيار أوضح، ووعود واقعية تناسب العطر الحقيقي.', 'type' => 'string'],
            'footer_brand_en' => ['value' => 'An Arabic perfume house built around calm discovery: try first, choose clearly, and expect realistic fragrance performance.', 'type' => 'string'],
            'footer_note_ar' => ['value' => 'تختلف مدة ثبات وفوحان العطر حسب البشرة، الطقس، وطريقة الاستخدام. نركز على تجربة واضحة ومريحة بدون مبالغات.', 'type' => 'string'],
            'footer_note_en' => ['value' => 'Longevity and projection vary by skin, weather, and use. Nafas keeps claims realistic and focused on a clear wearing experience.', 'type' => 'string'],
            'logo_url' => ['value' => '/assets/brand/nafas-logo.webp', 'type' => 'string'],
            'icon_url' => ['value' => '/assets/brand/nafas-icon.webp', 'type' => 'string'],
            'whatsapp_url' => ['value' => 'https://wa.me/201000000000', 'type' => 'string'],
            'instagram_url' => ['value' => '', 'type' => 'string'],
            'vodafone_cash_number' => ['value' => '01000000000', 'type' => 'string'],
            'instapay_handle' => ['value' => 'nafas@instapay', 'type' => 'string'],
        ];

        foreach ($settings as $key => $payload) {
            Setting::updateOrCreate(['key' => $key], $payload);
        }
    }
}
