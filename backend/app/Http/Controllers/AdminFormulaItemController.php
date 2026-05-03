<?php

namespace App\Http\Controllers;

use App\Models\Formula;
use App\Models\FormulaItem;
use Illuminate\Http\Request;

class AdminFormulaItemController extends Controller
{
    public function index(Formula $formula)
    {
        return response()->json($formula->items()->with('ingredient')->get());
    }

    public function store(Request $request, Formula $formula)
    {
        $validated = $request->validate([
            'ingredient_id' => ['nullable', 'exists:ingredients,id'],
            'ingredient_name' => ['required', 'string'],
            'quantity_ml' => ['nullable', 'numeric'],
            'quantity_grams' => ['nullable', 'numeric'],
            'cost_per_gram' => ['nullable', 'numeric', 'min:0'],
            'percentage' => ['nullable', 'numeric'],
            'internal_notes' => ['nullable', 'string'],
            'supplier_reference' => ['nullable', 'string'],
            'ifra_status' => ['nullable', 'string'],
            'sds_status' => ['nullable', 'string'],
        ]);

        $validated['quantity_ml'] = $validated['quantity_ml'] ?? 0;

        return response()->json($formula->items()->create($validated), 201);
    }

    public function show(FormulaItem $item)
    {
        return response()->json($item->load('ingredient'));
    }

    public function update(Request $request, FormulaItem $item)
    {
        $item->update($request->validate([
            'ingredient_id' => ['nullable', 'exists:ingredients,id'],
            'ingredient_name' => ['sometimes', 'string'],
            'quantity_ml' => ['nullable', 'numeric'],
            'quantity_grams' => ['nullable', 'numeric'],
            'cost_per_gram' => ['nullable', 'numeric', 'min:0'],
            'percentage' => ['nullable', 'numeric'],
            'internal_notes' => ['nullable', 'string'],
            'supplier_reference' => ['nullable', 'string'],
            'ifra_status' => ['nullable', 'string'],
            'sds_status' => ['nullable', 'string'],
        ]));

        return response()->json($item->load('ingredient'));
    }

    public function destroy(FormulaItem $item)
    {
        $item->delete();
        return response()->json(['message' => 'Formula item deleted']);
    }
}
