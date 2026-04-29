<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class AdminIngredientController extends Controller
{
    public function index()
    {
        return response()->json(Ingredient::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'unit' => ['required', 'string'],
            'supplier_name' => ['nullable', 'string'],
            'supplier_reference' => ['nullable', 'string'],
            'supplier_batch_reference' => ['nullable', 'string'],
            'ifra_status' => ['nullable', 'string'],
            'sds_status' => ['nullable', 'string'],
            'internal_notes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        return response()->json(Ingredient::create($validated), 201);
    }

    public function update(Request $request, Ingredient $ingredient)
    {
        $ingredient->update($request->validate([
            'name' => ['sometimes', 'string'],
            'unit' => ['sometimes', 'string'],
            'supplier_name' => ['nullable', 'string'],
            'supplier_reference' => ['nullable', 'string'],
            'supplier_batch_reference' => ['nullable', 'string'],
            'ifra_status' => ['nullable', 'string'],
            'sds_status' => ['nullable', 'string'],
            'internal_notes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]));

        return response()->json($ingredient);
    }

    public function destroy(Ingredient $ingredient)
    {
        $ingredient->delete();
        return response()->json(['message' => 'Ingredient deleted']);
    }
}
