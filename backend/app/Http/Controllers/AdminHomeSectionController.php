<?php

namespace App\Http\Controllers;

use App\Models\HomeSection;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminHomeSectionController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => HomeSection::with(['items.product:id,slug,name_ar,name_en,code,status,product_type'])
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $section = HomeSection::create($this->validated($request));

        return response()->json(['data' => $section->load('items.product')], 201);
    }

    public function show(HomeSection $homeSection)
    {
        return response()->json(['data' => $homeSection->load(['items.product:id,slug,name_ar,name_en,code,status,product_type'])]);
    }

    public function update(Request $request, HomeSection $homeSection)
    {
        $homeSection->update($this->validated($request, $homeSection->id));

        return response()->json(['data' => $homeSection->fresh()->load(['items.product:id,slug,name_ar,name_en,code,status,product_type'])]);
    }

    public function destroy(HomeSection $homeSection)
    {
        $homeSection->delete();

        return response()->noContent();
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'section_key' => ['required', 'string', 'max:120', Rule::unique('home_sections', 'section_key')->ignore($ignoreId)],
            'type' => ['required', 'string', 'max:80'],
            'title_ar' => ['nullable', 'string', 'max:255'],
            'title_en' => ['nullable', 'string', 'max:255'],
            'subtitle_ar' => ['nullable', 'string'],
            'subtitle_en' => ['nullable', 'string'],
            'body_ar' => ['nullable', 'string'],
            'body_en' => ['nullable', 'string'],
            'eyebrow_ar' => ['nullable', 'string', 'max:255'],
            'eyebrow_en' => ['nullable', 'string', 'max:255'],
            'cta_label_ar' => ['nullable', 'string', 'max:255'],
            'cta_label_en' => ['nullable', 'string', 'max:255'],
            'cta_url' => ['nullable', 'string', 'max:500'],
            'secondary_cta_label_ar' => ['nullable', 'string', 'max:255'],
            'secondary_cta_label_en' => ['nullable', 'string', 'max:255'],
            'secondary_cta_url' => ['nullable', 'string', 'max:500'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'mobile_image_url' => ['nullable', 'string', 'max:500'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'accent_color' => ['nullable', 'string', 'max:50'],
            'background_color' => ['nullable', 'string', 'max:50'],
            'settings' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
