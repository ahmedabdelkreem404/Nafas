<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index()
    {
        return response()->json(
            User::where('role', 'customer')
                ->with('customerProfile')
                ->withCount('orders')
                ->withSum(['orders as total_spent' => fn ($query) => $query->whereNotIn('status', ['cancelled', 'refunded'])], 'total_amount')
                ->get()
                ->map(function (User $customer) {
                    $orders = $customer->orders()->latest()->get();

                    return [
                        'id' => $customer->id,
                        'name' => $customer->name,
                        'email' => $customer->email,
                        'orders_count' => (int) $customer->orders_count,
                        'total_spent' => (float) ($customer->total_spent ?? 0),
                        'first_order_at' => optional($orders->sortBy('created_at')->first())->created_at,
                        'last_order_at' => optional($orders->first())->created_at,
                    ];
                })
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $validated['role'] = 'customer';

        return response()->json(User::create($validated), 201);
    }

    public function show(User $customer)
    {
        abort_if($customer->role !== 'customer', 404);
        $customer->load('orders.items.variant.product', 'addresses', 'customerProfile');
        $orders = $customer->orders->sortByDesc('created_at')->values();

        return response()->json([
            'id' => $customer->id,
            'name' => $customer->name,
            'email' => $customer->email,
            'orders' => $orders,
            'addresses' => $customer->addresses,
            'customer_profile' => $customer->customerProfile,
            'total_orders' => $orders->count(),
            'total_spent' => (float) $orders->whereNotIn('status', ['cancelled', 'refunded'])->sum('total_amount'),
            'first_order_at' => optional($orders->sortBy('created_at')->first())->created_at,
            'last_order_at' => optional($orders->first())->created_at,
        ]);
    }

    public function update(Request $request, User $customer)
    {
        abort_if($customer->role !== 'customer', 404);
        $customer->update($request->validate([
            'name' => ['sometimes', 'string'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $customer->id],
        ]));

        return response()->json($customer);
    }

    public function destroy(User $customer)
    {
        abort_if($customer->role !== 'customer', 404);
        $customer->delete();
        return response()->json(['message' => 'Customer deleted']);
    }
}
