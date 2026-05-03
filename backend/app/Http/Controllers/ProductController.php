<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\ContactInquiry;
use App\Models\Page;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\ReviewVote;
use App\Models\Setting;
use App\Models\WholesaleInquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        $query = Product::with([
            'variants' => fn ($builder) => $builder->where('is_active', true),
            'media',
        ])
            ->withCount(['reviews as reviews_count' => fn ($builder) => $builder
                ->whereNull('parent_id')
                ->where(function ($query) {
                    $query->where('status', 'approved')->where('is_approved', true);
                })])
            ->withAvg(['reviews as rating_average' => fn ($builder) => $builder
                ->whereNull('parent_id')
                ->where(function ($query) {
                    $query->where('status', 'approved')->where('is_approved', true);
                })], 'rating')
            ->where('status', 'active')
            ->whereNotIn('slug', ['discovery-set', 'men-gift-box', 'women-gift-box', 'discovery-gift-box']);

        if ($gender = request('gender')) {
            $query->where('gender', $gender);
        }

        if ($search = request('search')) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name_ar', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%")
                    ->orWhere('personality', 'like', "%{$search}%")
                    ->orWhere('scent_notes', 'like', "%{$search}%");
            });
        }

        return ProductResource::collection($query->get());
    }

    public function show($slug)
    {
        $product = Product::with([
            'variants' => fn ($builder) => $builder->where('is_active', true),
            'media',
        ])
            ->withCount(['reviews as reviews_count' => fn ($builder) => $builder
                ->whereNull('parent_id')
                ->where(function ($query) {
                    $query->where('status', 'approved')->where('is_approved', true);
                })])
            ->withAvg(['reviews as rating_average' => fn ($builder) => $builder
                ->whereNull('parent_id')
                ->where(function ($query) {
                    $query->where('status', 'approved')->where('is_approved', true);
                })], 'rating')
            ->where('status', 'active')
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProductResource($product);
    }

    public function categories()
    {
        return response()->json(Category::all());
    }

    public function homeContent()
    {
        return response()->json([
            'hero_title' => Setting::where('key', 'hero_title')->value('value') ?? 'نفَس',
            'hero_subtitle' => Setting::where('key', 'hero_subtitle')->value('value') ?? 'أول رشة تكمل حضورك',
            'video_url' => Setting::where('key', 'hero_video')->value('value') ?? 'https://www.w3schools.com/html/mov_bbb.mp4',
            'fallback_image_url' => Setting::where('key', 'hero_fallback_image')->value('value'),
            'featured_products' => ProductResource::collection(
                Product::with([
                    'variants' => fn ($builder) => $builder->where('is_active', true),
                    'media',
                ])->where('status', 'active')->take(4)->get()
            ),
            'pages' => Page::where('is_active', true)->get(),
        ]);
    }

    public function validateCart(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.variant_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['nullable', 'numeric'],
        ]);

        $validatedItems = [];
        $hasErrors = false;
        $subtotal = 0;

        foreach ($validated['items'] as $item) {
            $variant = ProductVariant::with('product')->find($item['variant_id']);
            $error = null;
            $stalePrice = false;

            if (!$variant) {
                $error = 'Product no longer exists';
            } elseif (!$variant->product || $variant->product->status !== 'active' || !$variant->is_active) {
                $error = 'Product is currently unavailable';
            } elseif ($variant->stock_quantity < $item['quantity']) {
                $error = "Only {$variant->stock_quantity} units available";
            }
            if (array_key_exists('price', $item) && $variant && (float) $item['price'] !== (float) $variant->retail_price) {
                $stalePrice = true;
                $hasErrors = true;
                $error = 'Price changed';
            }

            if ($error) {
                $hasErrors = true;
            } else {
                $subtotal += $variant->retail_price * $item['quantity'];
            }

            $validatedItems[] = [
                'variant_id' => $item['variant_id'],
                'price' => $variant ? $variant->retail_price : 0,
                'available' => $error === null,
                'error' => $error,
                'stock' => $variant ? $variant->stock_quantity : 0,
                'stale_price' => $stalePrice,
            ];
        }

        return response()->json([
            'items' => $validatedItems,
            'valid' => !$hasErrors,
            'subtotal' => $subtotal,
        ]);
    }

    public function contact(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        ContactInquiry::create($validated);

        return response()->json(['message' => 'Contact inquiry received'], 201);
    }

    public function wholesale(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
        ]);

        WholesaleInquiry::create($validated);

        return response()->json(['message' => 'Wholesale inquiry received'], 201);
    }

    public function reviews(string $slug)
    {
        $product = Product::where('status', 'active')->where('slug', $slug)->firstOrFail();
        $reviews = Review::query()
            ->where('product_id', $product->id)
            ->whereNull('parent_id')
            ->where(function ($query) {
                $query->where('status', 'approved')->where('is_approved', true);
            })
            ->withCount('replies')
            ->latest()
            ->paginate(10);

        return response()->json($reviews->through(fn (Review $review) => $this->transformReview($review)));
    }

    public function storeReview(Request $request, string $slug)
    {
        $product = Product::where('status', 'active')->where('slug', $slug)->firstOrFail();
        $validated = $request->validate([
            'author_name' => ['required', 'string', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'body' => ['required', 'string', 'min:3'],
        ]);

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => $request->user()?->id,
            'customer_id' => $request->user()?->customerProfile?->id,
            'author_name' => $validated['author_name'],
            'rating' => $validated['rating'],
            'body' => $validated['body'],
            'comment' => $validated['body'],
            'status' => 'pending',
            'session_key' => $request->header('X-Session-Key'),
            'is_approved' => false,
            'likes' => 0,
            'dislikes' => 0,
        ]);

        return response()->json([
            'message' => 'Review submitted for moderation',
            'data' => $this->transformReview($review->fresh()),
        ], 201);
    }

    public function reviewReplies(Review $review)
    {
        $replies = $review->replies()
            ->where(function ($query) {
                $query->where('status', 'approved')->where('is_approved', true);
            })
            ->paginate(20);

        return response()->json($replies->through(fn (Review $reply) => $this->transformReview($reply)));
    }

    public function storeReviewReply(Request $request, Review $review)
    {
        $validated = $request->validate([
            'author_name' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'min:2'],
        ]);

        $reply = Review::create([
            'product_id' => $review->product_id,
            'user_id' => $request->user()?->id,
            'customer_id' => $request->user()?->customerProfile?->id,
            'parent_id' => $review->id,
            'author_name' => $validated['author_name'],
            'rating' => 0,
            'body' => $validated['body'],
            'comment' => $validated['body'],
            'status' => 'pending',
            'session_key' => $request->header('X-Session-Key'),
            'is_approved' => false,
            'likes' => 0,
            'dislikes' => 0,
        ]);

        return response()->json([
            'message' => 'Reply submitted for moderation',
            'data' => $this->transformReview($reply->fresh()),
        ], 201);
    }

    public function voteReview(Request $request, Review $review)
    {
        if ($review->status !== 'approved' || !$review->is_approved) {
            abort(404);
        }

        $validated = $request->validate([
            'type' => ['required', 'in:like,dislike'],
        ]);

        $sessionKey = $request->header('X-Session-Key');
        if (!$sessionKey) {
            return response()->json(['message' => 'Session key is required'], 422);
        }

        DB::transaction(function () use ($review, $validated, $sessionKey) {
            $vote = ReviewVote::firstOrNew([
                'review_id' => $review->id,
                'session_key' => $sessionKey,
            ]);

            if ($vote->exists && $vote->type === $validated['type']) {
                if ($validated['type'] === 'like') {
                    $review->decrement('likes');
                } else {
                    $review->decrement('dislikes');
                }
                $vote->delete();
                return;
            }

            if ($vote->exists && $vote->type !== $validated['type']) {
                if ($vote->type === 'like') {
                    $review->decrement('likes');
                } else {
                    $review->decrement('dislikes');
                }
            }

            $vote->type = $validated['type'];
            $vote->save();

            if ($validated['type'] === 'like') {
                $review->increment('likes');
            } else {
                $review->increment('dislikes');
            }
        });

        return response()->json([
            'data' => [
                'likes' => $review->fresh()->likes,
                'dislikes' => $review->fresh()->dislikes,
            ],
        ]);
    }

    protected function transformReview(Review $review): array
    {
        return [
            'id' => $review->id,
            'author_name' => $review->author_name ?: $review->user?->name ?: 'Nafas Guest',
            'rating' => (int) $review->rating,
            'body' => $review->body ?: $review->comment,
            'created_at' => $review->created_at,
            'likes' => (int) $review->likes,
            'dislikes' => (int) $review->dislikes,
            'reply_count' => $review->replies_count ?? $review->replies()->count(),
            'parent_id' => $review->parent_id,
        ];
    }
}
