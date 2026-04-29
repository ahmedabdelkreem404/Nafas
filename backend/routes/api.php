<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AuthController;

// Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'google']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::get('/me/orders', [AuthController::class, 'myOrders'])->middleware('auth:sanctum');
Route::get('/me/orders/{id}', [AuthController::class, 'myOrder'])->middleware('auth:sanctum');
Route::get('/orders/confirmation/{orderNumber}', [AuthController::class, 'orderByNumber'])->middleware('optional.auth');

// Public Product/Content Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'categories']);
Route::get('/home', [ProductController::class, 'homeContent']);
Route::get('/pages/{slug}', [PageController::class, 'show']);
Route::post('/cart/validate', [ProductController::class, 'validateCart']);
Route::post('/checkout', [CheckoutController::class, 'store'])->middleware('optional.auth');
Route::post('/contact', [ProductController::class, 'contact']);
Route::post('/wholesale-inquiry', [ProductController::class, 'wholesale']);

Route::get('/cart', [CartController::class, 'show'])->middleware('optional.auth');
Route::post('/cart/items', [CartController::class, 'add'])->middleware('optional.auth');
Route::patch('/cart/items/{cartItem}', [CartController::class, 'update'])->middleware('optional.auth');
Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy'])->middleware('optional.auth');
Route::delete('/cart/clear', [CartController::class, 'clear'])->middleware('optional.auth');
Route::post('/cart/merge', [CartController::class, 'merge'])->middleware('auth:sanctum');

Route::get('/products/{slug}/reviews', [ProductController::class, 'reviews']);
Route::post('/products/{slug}/reviews', [ProductController::class, 'storeReview'])->middleware('optional.auth');
Route::get('/reviews/{review}/replies', [ProductController::class, 'reviewReplies']);
Route::post('/reviews/{review}/replies', [ProductController::class, 'storeReviewReply'])->middleware('optional.auth');
Route::post('/reviews/{review}/vote', [ProductController::class, 'voteReview']);

// Admin Protected Routes
Route::middleware(['auth:sanctum', 'role'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminOrderController::class, 'dashboard']);

    // Admin Products (super_admin, admin, content_manager)
    Route::middleware('role:admin,content_manager')->group(function () {
        Route::apiResource('products', AdminProductController::class);
        Route::apiResource('products.variants', \App\Http\Controllers\AdminProductVariantController::class)->shallow();
        Route::apiResource('products.media', \App\Http\Controllers\AdminProductMediaController::class)->shallow();
        
        Route::apiResource('pages', \App\Http\Controllers\AdminPageController::class);
        Route::apiResource('pages.sections', \App\Http\Controllers\AdminPageSectionController::class)->shallow();
        Route::apiResource('settings', \App\Http\Controllers\AdminSettingController::class);
    });

    // Admin Orders (super_admin, admin, order_manager)
    Route::middleware('role:admin,order_manager')->group(function () {
        Route::apiResource('orders', AdminOrderController::class);
        Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        Route::apiResource('customers', \App\Http\Controllers\AdminCustomerController::class);
        Route::apiResource('coupons', \App\Http\Controllers\AdminCouponController::class);
    });

    // Admin Inventory & Formulas (super_admin, admin, inventory_manager)
    Route::middleware('role:admin,inventory_manager')->group(function () {
        Route::apiResource('formulas', \App\Http\Controllers\AdminFormulaController::class);
        Route::apiResource('formulas.items', \App\Http\Controllers\AdminFormulaItemController::class)->shallow();
        Route::apiResource('batches', \App\Http\Controllers\AdminBatchController::class);
        Route::apiResource('quality-checks', \App\Http\Controllers\AdminQualityCheckController::class);
        Route::apiResource('ingredients', \App\Http\Controllers\AdminIngredientController::class)->except(['show']);
        
        Route::get('/inventory/low-stock', [\App\Http\Controllers\AdminInventoryController::class, 'lowStock']);
        Route::get('/inventory/movements', [\App\Http\Controllers\AdminInventoryController::class, 'movements']);
        Route::post('/inventory/adjustments', [\App\Http\Controllers\AdminInventoryController::class, 'adjustments']);
    });
    
    // Analytics (super_admin, admin)
    Route::middleware('role:admin')->group(function () {
        Route::get('/analytics/sales', [\App\Http\Controllers\AdminAnalyticsController::class, 'sales']);
        Route::get('/analytics/products', [\App\Http\Controllers\AdminAnalyticsController::class, 'products']);
    });
});
