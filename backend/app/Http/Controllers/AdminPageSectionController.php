<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\Request;

class AdminPageSectionController extends Controller
{
    public function index(Page $page)
    {
        return response()->json($page->sections);
    }

    public function store(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => ['required', 'string'],
            'section_key' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        return response()->json($page->sections()->create($validated), 201);
    }

    public function update(Request $request, PageSection $pageSection)
    {
        $pageSection->update($request->validate([
            'title' => ['sometimes', 'string'],
            'section_key' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]));

        return response()->json($pageSection);
    }

    public function destroy(PageSection $pageSection)
    {
        $pageSection->delete();
        return response()->json(['message' => 'Page section deleted']);
    }
}
