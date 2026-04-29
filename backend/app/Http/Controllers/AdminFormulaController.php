<?php

namespace App\Http\Controllers;

use App\Models\Formula;
use Illuminate\Http\Request;

class AdminFormulaController extends Controller
{
    public function index()
    {
        return response()->json(Formula::with('product', 'items.ingredient')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'oil_percentage' => 'required|numeric',
            'alcohol_percentage' => 'required|numeric',
            'ifra_status' => 'nullable|string',
            'sds_status' => 'nullable|string',
            'supplier_name' => 'nullable|string',
            'supplier_reference' => 'nullable|string',
            'supplier_batch_reference' => 'nullable|string',
            'is_admin_only' => 'nullable|boolean',
            'internal_notes' => 'nullable|string',
        ]);

        return response()->json(Formula::create($validated), 201);
    }

    public function show(Formula $formula)
    {
        return response()->json($formula->load('product', 'items.ingredient'));
    }

    public function update(Request $request, Formula $formula)
    {
        $formula->update($request->validate([
            'oil_percentage' => 'sometimes|numeric',
            'alcohol_percentage' => 'sometimes|numeric',
            'ifra_status' => 'nullable|string',
            'sds_status' => 'nullable|string',
            'supplier_name' => 'nullable|string',
            'supplier_reference' => 'nullable|string',
            'supplier_batch_reference' => 'nullable|string',
            'is_admin_only' => 'nullable|boolean',
            'internal_notes' => 'nullable|string',
        ]));

        return response()->json($formula->fresh('product', 'items.ingredient'));
    }

    public function destroy(Formula $formula)
    {
        $formula->delete();
        return response()->json(['message' => 'Formula deleted']);
    }
}
