<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Services\Notifications\OrderNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function store(Request $request, OrderNotificationService $notificationService)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email',
            'address' => 'required|string',
            'city' => 'required|string',
            'governorate' => 'required|string',
            'delivery_notes' => 'nullable|string',
            'payment_method' => 'required|string|in:cash_on_delivery,vodafone_cash,instapay',
            'payment_reference' => 'nullable|required_if:payment_method,vodafone_cash,instapay|string|max:255',
            'payment_payer_phone' => 'nullable|string|max:50',
            'payment_proof' => 'nullable|prohibited_if:payment_method,cash_on_delivery|image|mimes:jpg,jpeg,png,webp|max:3072',
            'coupon_code' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated, $request, $notificationService) {
            $subtotalAmount = 0;
            $discountAmount = 0;
            $shippingAmount = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $variant = ProductVariant::with('product')->lockForUpdate()->findOrFail($item['variant_id']);

                if (!$variant->product || $variant->product->status !== 'active' || !$variant->is_active) {
                    return response()->json(['error' => "Variant {$variant->sku} is inactive"], 422);
                }

                if ($variant->stock_quantity < $item['quantity']) {
                    return response()->json(['error' => "Insufficient stock for {$variant->sku}"], 422);
                }

                $lineTotal = $variant->retail_price * $item['quantity'];
                $subtotalAmount += $lineTotal;

                $orderItems[] = [
                    'product_variant_id' => $variant->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $variant->retail_price,
                ];
            }

            $coupon = null;
            if (!empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', $validated['coupon_code'])->where('is_active', true)->first();

                if (!$coupon) {
                    return response()->json(['error' => 'Invalid coupon code'], 422);
                }
                if ($coupon->expiry_date && now()->gt($coupon->expiry_date)) {
                    return response()->json(['error' => 'Coupon has expired'], 422);
                }
                if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
                    return response()->json(['error' => 'Coupon usage limit reached'], 422);
                }
                if ($subtotalAmount < $coupon->min_cart_total) {
                    return response()->json(['error' => 'Coupon minimum not met'], 422);
                }

                $discountAmount = $coupon->discount_type === 'percentage'
                    ? round(($subtotalAmount * $coupon->discount_value) / 100, 2)
                    : min($subtotalAmount, $coupon->discount_value);
            }

            $totalAmount = max(0, $subtotalAmount - $discountAmount + $shippingAmount);
            $customer = null;

            if ($request->user()) {
                $customer = Customer::updateOrCreate(
                    ['user_id' => $request->user()->id],
                    [
                        'name' => $validated['customer_name'],
                        'email' => $validated['email'] ?? $request->user()->email,
                        'phone' => $validated['phone'],
                        'address' => $validated['address'],
                        'city' => $validated['city'],
                        'governorate' => $validated['governorate'],
                    ]
                );
            }

            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'customer_id' => $customer?->id,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['phone'],
                'customer_email' => $validated['email'] ?? null,
                'address' => $validated['address'],
                'city' => $validated['city'],
                'governorate' => $validated['governorate'],
                'subtotal_amount' => $subtotalAmount,
                'discount_amount' => $discountAmount,
                'shipping_amount' => $shippingAmount,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'coupon_code' => $coupon?->code,
                'delivery_notes' => $validated['delivery_notes'] ?? null,
                'stock_deducted' => false,
            ]);

            foreach ($orderItems as $orderItemData) {
                $order->items()->create($orderItemData);
            }

            if ($coupon) {
                $coupon->increment('used_count');
                CouponUsage::create([
                    'coupon_id' => $coupon->id,
                    'order_id' => $order->id,
                    'user_id' => $request->user()?->id,
                    'discount_amount' => $discountAmount,
                ]);
            }

            $isManualPayment = in_array($validated['payment_method'], ['vodafone_cash', 'instapay'], true);
            $proofImagePath = null;

            if ($isManualPayment && $request->hasFile('payment_proof')) {
                $proofImagePath = $request->file('payment_proof')->store(
                    'payment-proofs/' . $order->order_number,
                    'local'
                );
            }

            Payment::create([
                'order_id' => $order->id,
                'provider' => $validated['payment_method'],
                'method' => $validated['payment_method'],
                'status' => $isManualPayment ? 'pending_review' : 'pending',
                'amount' => $totalAmount,
                'currency' => 'EGP',
                'reference' => $isManualPayment ? ($validated['payment_reference'] ?? null) : 'COD-' . $order->order_number,
                'payer_phone' => $validated['payment_payer_phone'] ?? null,
                'proof_image_path' => $proofImagePath,
                'review_status' => $isManualPayment ? 'pending' : null,
                'provider_payload' => [
                    'source' => 'checkout',
                    'manual_review_required' => $isManualPayment,
                    'proof_uploaded' => (bool) $proofImagePath,
                ],
            ]);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => null,
                'to_status' => 'pending',
                'user_id' => $request->user()?->id,
                'notes' => 'Order created via checkout',
            ]);

            if ($request->user()) {
                \App\Models\Cart::where('user_id', $request->user()->id)->first()?->items()->delete();
            }

            $notificationService->sendOrderConfirmation($order);
            $notificationService->notifyAdminNewOrder($order);

            return response()->json([
                'message' => $isManualPayment
                    ? 'Order created successfully. Payment is pending review.'
                    : 'Order created successfully',
                'order' => $order->load('items.variant.product', 'history', 'payment'),
            ], 201);
        });
    }
}
