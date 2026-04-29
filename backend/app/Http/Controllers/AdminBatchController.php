<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\ProductionBatch;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminBatchController extends Controller
{
    public function index()
    {
        return response()->json(ProductionBatch::with('product', 'variant', 'qualityChecks')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity_produced' => 'required|integer|min:1',
            'mix_date' => 'nullable|date',
            'maturation_start_date' => 'nullable|date',
            'allowed_sale_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $validated['batch_code'] = 'BATCH-' . strtoupper(Str::random(6));
        $validated['qc_status'] = 'drafted';

        return response()->json(ProductionBatch::create($validated), 201);
    }

    public function show(ProductionBatch $batch)
    {
        return response()->json($batch->load('product', 'variant', 'qualityChecks'));
    }

    public function update(Request $request, ProductionBatch $batch)
    {
        $oldStatus = $batch->qc_status;
        $validated = $request->validate([
            'qc_status' => 'required|string',
            'mix_date' => 'nullable|date',
            'maturation_start_date' => 'nullable|date',
            'allowed_sale_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $batch->update($validated);

        if ($validated['qc_status'] === 'approved' && $oldStatus !== 'approved') {
            $variant = $batch->variant;
            $variant->increment('stock_quantity', $batch->quantity_produced);

            InventoryMovement::create([
                'product_variant_id' => $variant->id,
                'type' => 'addition',
                'quantity' => $batch->quantity_produced,
                'reason' => 'batch_approved',
                'production_batch_id' => $batch->id,
            ]);
        }

        return response()->json($batch->fresh('product', 'variant', 'qualityChecks'));
    }

    public function destroy(ProductionBatch $batch)
    {
        $batch->delete();
        return response()->json(['message' => 'Batch deleted']);
    }
}
