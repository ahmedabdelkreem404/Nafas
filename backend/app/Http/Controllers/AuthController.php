<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use App\Notifications\WelcomeNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
        ]);

        $customer = Customer::updateOrCreate(
            ['email' => $validated['email']],
            [
                'user_id' => $user->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'email_verified_at' => now(),
            ]
        );

        Notification::route('mail', $validated['email'])
            ->notify((new WelcomeNotification($user->name))->onQueue('notifications'));

        return response()->json($this->buildAuthResponse($user->fresh('customerProfile')), 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        return response()->json($this->buildAuthResponse($user->fresh('customerProfile')));
    }

    public function google(Request $request)
    {
        $validated = $request->validate([
            'id_token' => ['required', 'string'],
        ]);

        $tokenInfo = Http::acceptJson()->get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $validated['id_token'],
        ]);

        if ($tokenInfo->failed()) {
            throw ValidationException::withMessages([
                'id_token' => ['Google token verification failed.'],
            ]);
        }

        $payload = $tokenInfo->json();
        $googleId = $payload['sub'] ?? null;
        $email = $payload['email'] ?? null;
        $name = $payload['name'] ?? ($payload['given_name'] ?? 'Google User');
        $profilePicture = $payload['picture'] ?? null;

        if (!$googleId || !$email) {
            throw ValidationException::withMessages([
                'id_token' => ['Google token payload is incomplete.'],
            ]);
        }

        $customer = Customer::query()
            ->where('google_id', $googleId)
            ->orWhere('email', $email)
            ->first();

        if (!$customer) {
            $customer = Customer::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'profile_picture' => $profilePicture,
                'email_verified_at' => now(),
            ]);
        } else {
            $customer->fill([
                'name' => $customer->name ?: $name,
                'email' => $customer->email ?: $email,
                'google_id' => $customer->google_id ?: $googleId,
                'profile_picture' => $customer->profile_picture ?: $profilePicture,
                'email_verified_at' => $customer->email_verified_at ?: now(),
            ])->save();
        }

        $user = $customer->user ?: User::where('email', $email)->first();
        if (!$user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make(\Illuminate\Support\Str::random(40)),
                'role' => 'customer',
            ]);
        } else {
            $user->fill([
                'name' => $user->name ?: $name,
                'email' => $email,
            ])->save();
        }

        $customer->forceFill(['user_id' => $user->id])->save();

        return response()->json($this->buildAuthResponse($user->fresh('customerProfile')));
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($this->transformUser($request->user()->load('customerProfile.orders')));
    }

    public function myOrders(Request $request)
    {
        return response()->json(
            $request->user()->orders()->with('items.variant.product', 'history')->latest()->get()
        );
    }

    public function myOrder(Request $request, $id)
    {
        return response()->json(
            $request->user()->orders()->with('items.variant.product', 'history')->findOrFail($id)
        );
    }

    public function orderByNumber(Request $request, string $orderNumber)
    {
        $validated = $request->validate([
            'phone' => ['required_without:email', 'string'],
            'email' => ['nullable', 'email'],
        ]);

        $query = \App\Models\Order::with('items.variant.product', 'history', 'payment')->where('order_number', $orderNumber);

        if ($request->user()) {
            $customerId = $request->user()->customerProfile?->id;
            if (!$customerId) {
                abort(404);
            }
            $query->where('customer_id', $customerId);
        } else {
            $query->where(function ($builder) use ($validated) {
                if (!empty($validated['phone'])) {
                    $builder->where('customer_phone', $validated['phone']);
                }
                if (!empty($validated['email'])) {
                    $builder->orWhere('customer_email', $validated['email']);
                }
            });
        }

        return response()->json($query->firstOrFail());
    }

    protected function buildAuthResponse(User $user): array
    {
        return [
            'token' => $user->createToken('auth-token')->plainTextToken,
            'user' => $this->transformUser($user),
        ];
    }

    protected function transformUser(User $user): array
    {
        $user->loadMissing('customerProfile.orders');
        $customer = $user->customerProfile;
        $orders = $customer?->orders ?? collect();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'profile_picture' => $customer?->profile_picture,
            'google_id' => $customer?->google_id,
            'customer' => $customer ? [
                'id' => $customer->id,
                'total_orders' => $orders->count(),
                'total_spent' => round((float) $orders->whereNotIn('status', ['cancelled', 'refunded'])->sum('total_amount'), 2),
                'last_order_at' => optional($orders->sortByDesc('created_at')->first())->created_at,
            ] : null,
        ];
    }
}
