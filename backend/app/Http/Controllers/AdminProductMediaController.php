<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminProductMediaController extends Controller
{
    public function index(Product $product)
    {
        return response()->json($product->media);
    }

    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'url' => 'nullable|url|required_without:files',
            'files' => 'nullable|array',
            'files.*' => 'file|max:61440|mimetypes:image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime',
            'type' => 'nullable|string|in:image,video',
            'alt_text' => 'nullable|string',
            'is_primary' => 'boolean',
        ]);

        if ($validated['is_primary'] ?? false) {
            $product->media()->update(['is_primary' => false]);
        }

        $created = collect();
        $files = $request->file('files', []);

        foreach ($files as $index => $file) {
            $path = $file->store("products/{$product->id}", 'public');
            $mime = (string) $file->getMimeType();
            $created->push($product->media()->create([
                'url' => Storage::disk('public')->url($path),
                'type' => str_starts_with($mime, 'video/') ? 'video' : 'image',
                'alt_text' => $validated['alt_text'] ?? $product->name_ar,
                'is_primary' => ($validated['is_primary'] ?? false) && $index === 0,
            ]));
        }

        if (! $created->count() && ! empty($validated['url'])) {
            $created->push($product->media()->create([
                'url' => $validated['url'],
                'type' => $validated['type'] ?? 'image',
                'alt_text' => $validated['alt_text'] ?? null,
                'is_primary' => $validated['is_primary'] ?? false,
            ]));
        }

        return response()->json($created->count() === 1 ? $created->first() : ['data' => $created->values()], 201);
    }

    public function show(ProductMedia $medium)
    {
        return response()->json($medium);
    }

    public function update(Request $request, ProductMedia $medium)
    {
        $validated = $request->validate([
            'url' => 'sometimes|url',
            'type' => 'sometimes|string|in:image,video',
            'alt_text' => 'nullable|string',
            'is_primary' => 'nullable|boolean',
        ]);

        if (($validated['is_primary'] ?? false) && $medium->product_id) {
            Product::find($medium->product_id)?->media()->update(['is_primary' => false]);
        }

        $medium->update($validated);
        return response()->json($medium);
    }

    public function destroy(ProductMedia $medium)
    {
        $medium->delete();
        return response()->json(['message' => 'Media deleted']);
    }
}
