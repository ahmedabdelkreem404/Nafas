<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function sales()
    {
        $sales = Order::select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as total'))
            ->where('status', '!=', 'cancelled')
            ->groupBy('date')
            ->get();
        return response()->json($sales);
    }

    public function products()
    {
        $topProducts = DB::table('order_items')
            ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->select('products.name_en', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name_en')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();
        return response()->json($topProducts);
    }
}
