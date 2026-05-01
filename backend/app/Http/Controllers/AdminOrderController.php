<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\ProductVariant;
use App\Services\OrderInventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminOrderController extends Controller
{
    public function dashboard(Request $request)
    {
        $monthStart = now()->startOfMonth();
        $todayStart = now()->startOfDay();
        $salesStatuses = ['confirmed', 'preparing', 'shipped', 'delivered'];

        $recentOrders = Order::query()
            ->latest()
            ->with('customer')
            ->take(5)
            ->get();

        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->where('orders.created_at', '>=', $monthStart)
            ->whereIn('orders.status', $salesStatuses)
            ->select(
                'products.id',
                'products.name_ar',
                'products.name_en',
                DB::raw('SUM(order_items.quantity) as sales_count')
            )
            ->groupBy('products.id', 'products.name_ar', 'products.name_en')
            ->orderByDesc('sales_count')
            ->limit(5)
            ->get();

        $criticalStock = ProductVariant::with('product')
            ->where('stock_quantity', '<=', 3)
            ->orderBy('stock_quantity')
            ->take(6)
            ->get();

        $lowStock = ProductVariant::with('product')
            ->where('stock_quantity', '<=', 10)
            ->where('stock_quantity', '>', 3)
            ->orderBy('stock_quantity')
            ->take(6)
            ->get();

        return response()->json([
            'orders_count' => Order::count(),
            'products_count' => \App\Models\Product::count(),
            'customers_count' => \App\Models\User::where('role', 'customer')->count(),
            'total_sales' => Order::whereNotIn('status', ['cancelled', 'refunded'])->sum('total_amount'),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'average_order_value' => round((float) Order::avg('total_amount'), 2),
            'today_revenue' => (float) Order::whereIn('status', $salesStatuses)->where('created_at', '>=', $todayStart)->sum('total_amount'),
            'month_revenue' => (float) Order::whereIn('status', $salesStatuses)->where('created_at', '>=', $monthStart)->sum('total_amount'),
            'new_orders_count' => Order::whereIn('status', ['pending', 'confirmed'])->count(),
            'recent_orders' => $recentOrders,
            'critical_stock' => $criticalStock,
            'low_stock' => $lowStock,
            'top_products_month' => $topProducts,
        ]);
    }

    public function index()
    {
        return response()->json(Order::with('items.variant.product', 'history', 'payment')->latest()->get());
    }

    public function store(Request $request)
    {
        return response()->json(['message' => 'Use public checkout to create orders'], 405);
    }

    public function show(Order $order)
    {
        return response()->json($order->load('items.variant.product', 'history', 'payment'));
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'admin_notes' => ['nullable', 'string'],
        ]);

        $order->update($validated);

        return response()->json($order->fresh('items.variant.product', 'history', 'payment'));
    }

    public function destroy(Order $order)
    {
        return response()->json(['message' => 'Orders cannot be deleted'], 405);
    }

    public function updateStatus(Request $request, $id, OrderInventoryService $inventoryService)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,shipped,delivered,cancelled,refunded',
            'notes' => 'nullable|string',
        ]);

        $order = Order::with('items.variant')->findOrFail($id);
        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        if ($oldStatus === $newStatus) {
            return response()->json(['message' => 'Status unchanged', 'order' => $order]);
        }

        DB::transaction(function () use ($order, $oldStatus, $newStatus, $validated, $request, $inventoryService) {
            if (!$order->stock_deducted && in_array($newStatus, ['confirmed', 'preparing', 'shipped', 'delivered'], true)) {
                $inventoryService->deduct($order, 'order_status_updated');
            }

            if ($order->stock_deducted && in_array($newStatus, ['cancelled', 'refunded'], true)) {
                $inventoryService->restore($order, 'order_cancelled_restored');
            }

            $order->update(['status' => $newStatus]);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => $oldStatus,
                'to_status' => $newStatus,
                'user_id' => $request->user()?->id,
                'notes' => $validated['notes'] ?? null,
            ]);
        });

        return response()->json([
            'message' => "Order status updated to {$newStatus}",
            'order' => $order->fresh('items.variant.product', 'history'),
        ]);
    }
}
