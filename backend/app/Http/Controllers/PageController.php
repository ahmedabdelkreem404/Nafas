<?php

namespace App\Http\Controllers;

use App\Models\Page;

class PageController extends Controller
{
    public function show(string $slug)
    {
        return response()->json(
            Page::with(['sections' => fn ($query) => $query->where('is_active', true)])
                ->where('slug', $slug)
                ->where('is_active', true)
                ->firstOrFail()
        );
    }
}
