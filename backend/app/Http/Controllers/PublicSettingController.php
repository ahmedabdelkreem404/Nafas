<?php

namespace App\Http\Controllers;

use App\Models\Setting;

class PublicSettingController extends Controller
{
    private const PUBLIC_KEYS = [
        'brand_name_ar',
        'brand_name_en',
        'brand_subtitle_ar',
        'brand_subtitle_en',
        'footer_title_ar',
        'footer_title_en',
        'footer_brand_ar',
        'footer_brand_en',
        'footer_note_ar',
        'footer_note_en',
        'logo_url',
        'icon_url',
        'whatsapp_url',
        'instagram_url',
        'vodafone_cash_number',
        'instapay_handle',
    ];

    public function __invoke()
    {
        return response()->json([
            'data' => Setting::query()
                ->whereIn('key', self::PUBLIC_KEYS)
                ->get()
                ->mapWithKeys(fn (Setting $setting) => [
                    $setting->key => $this->castValue($setting->value, $setting->type),
                ]),
        ]);
    }

    private function castValue(?string $value, string $type): mixed
    {
        if ($type === 'boolean') {
            return filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }

        if ($type === 'number') {
            return is_numeric($value) ? (float) $value : 0;
        }

        if ($type === 'json') {
            return json_decode($value ?: 'null', true);
        }

        return $value;
    }
}
