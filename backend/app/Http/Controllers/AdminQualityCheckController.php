<?php

namespace App\Http\Controllers;

use App\Models\ProductionBatch;
use App\Models\QualityCheck;
use Illuminate\Http\Request;

class AdminQualityCheckController extends Controller
{
    public function index()
    {
        return response()->json(QualityCheck::with('batch.product', 'batch.variant')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'production_batch_id' => 'required|exists:production_batches,id',
            'clarity_test' => 'required|string',
            'sprayer_test' => 'required|string',
            'leak_test' => 'required|string',
            'scent_test' => 'required|string',
            'projection_notes' => 'nullable|string',
            'longevity_notes' => 'nullable|string',
            'approval_status' => 'required|in:approved,rejected,pending',
            'notes' => 'nullable|string',
        ]);

        $qc = QualityCheck::create($validated);
        $this->syncBatchStatus($validated['production_batch_id'], $validated['approval_status']);
        return response()->json($qc->load('batch.product', 'batch.variant'), 201);
    }

    public function show(QualityCheck $qualityCheck)
    {
        return response()->json($qualityCheck->load('batch.product', 'batch.variant'));
    }

    public function update(Request $request, QualityCheck $qualityCheck)
    {
        $qualityCheck->update($request->validate([
            'clarity_test' => 'sometimes|string',
            'sprayer_test' => 'sometimes|string',
            'leak_test' => 'sometimes|string',
            'scent_test' => 'sometimes|string',
            'projection_notes' => 'nullable|string',
            'longevity_notes' => 'nullable|string',
            'approval_status' => 'sometimes|in:approved,rejected,pending',
            'notes' => 'nullable|string',
        ]));

        $this->syncBatchStatus($qualityCheck->production_batch_id, $qualityCheck->approval_status);
        return response()->json($qualityCheck->fresh('batch.product', 'batch.variant'));
    }

    public function destroy(QualityCheck $qualityCheck)
    {
        $qualityCheck->delete();
        return response()->json(['message' => 'Quality check deleted']);
    }

    private function syncBatchStatus(int $batchId, string $approvalStatus): void
    {
        $batch = ProductionBatch::findOrFail($batchId);
        $batch->update([
            'qc_status' => $approvalStatus === 'approved' ? 'approved' : ($approvalStatus === 'rejected' ? 'rejected' : 'qc_pending'),
        ]);
    }
}
