<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;

class AdminPageController extends Controller
{
    public function index()
    {
        return response()->json(Page::with('sections')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:pages',
            'title' => 'required|string',
            'content' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $page = Page::create($validated);
        return response()->json($page, 201);
    }

    public function show(Page $page)
    {
        return response()->json($page->load('sections'));
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'slug' => 'string|unique:pages,slug,'.$page->id,
            'title' => 'string',
            'content' => 'string',
            'is_active' => 'boolean',
        ]);

        $page->update($validated);
        return response()->json($page);
    }

    public function destroy(Page $page)
    {
        $page->delete();
        return response()->json(['message' => 'Page deleted']);
    }
}
