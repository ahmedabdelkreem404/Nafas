<!DOCTYPE html>
<html lang="{{ $locale === 'en' ? 'en' : 'ar' }}" dir="{{ $locale === 'en' ? 'ltr' : 'rtl' }}">
<head>
    <meta charset="UTF-8">
    <title>{{ $locale === 'en' ? 'Order confirmed' : 'تأكيد الطلب' }}</title>
</head>
<body style="margin:0;background:#0b0910;color:#f2ead8;font-family:Arial,'Segoe UI',sans-serif;">
    <div style="max-width:680px;margin:0 auto;padding:32px 20px;">
        <div style="background:#15111d;border:1px solid rgba(201,160,78,.28);border-radius:24px;padding:32px;">
            <p style="margin:0 0 12px;color:#c9a04e;font-size:13px;letter-spacing:.08em;text-transform:uppercase;">
                {{ $locale === 'en' ? 'Maison Nafas' : 'دار نفَس' }}
            </p>
            <h1 style="margin:0 0 12px;font-size:30px;line-height:1.2;">
                {{ $locale === 'en' ? 'Your order has been received' : 'تم استلام طلبك بنجاح' }}
            </h1>
            <p style="margin:0 0 24px;color:rgba(242,234,216,.78);line-height:1.8;">
                {{ $locale === 'en' ? "Hello {$order->customer_name}," : "مرحباً {$order->customer_name}،" }}
                {{ $locale === 'en' ? 'thank you for choosing Nafas. We are preparing your order now.' : 'شكرًا لاختيارك نفَس. بدأنا تجهيز طلبك الآن.' }}
            </p>

            <div style="background:#100d15;border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:18px 20px;margin-bottom:20px;">
                <strong style="display:block;margin-bottom:6px;color:#e4c070;">
                    {{ $locale === 'en' ? 'Order number' : 'رقم الطلب' }}
                </strong>
                <span style="font-family:'Courier New',monospace;font-size:18px;">{{ $order->order_number }}</span>
            </div>

            <div style="margin-bottom:24px;">
                <strong style="display:block;margin-bottom:12px;color:#e4c070;">
                    {{ $locale === 'en' ? 'Items' : 'المنتجات' }}
                </strong>
                @foreach($order->items as $item)
                    <div style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,.07);">
                        <div style="font-weight:700;">
                            {{ $item->variant?->product?->name_ar ?: $item->variant?->product?->name_en ?: 'Product' }}
                        </div>
                        <div style="color:rgba(242,234,216,.72);font-size:14px;line-height:1.7;">
                            {{ $item->variant?->label ?: 'Variant' }} ·
                            {{ $locale === 'en' ? 'Qty' : 'الكمية' }} {{ $item->quantity }} ·
                            {{ number_format($item->unit_price, 0) }} EGP
                        </div>
                    </div>
                @endforeach
            </div>

            <div style="display:flex;justify-content:space-between;gap:16px;align-items:center;padding:16px 0;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:20px;">
                <strong>{{ $locale === 'en' ? 'Order total' : 'إجمالي الطلب' }}</strong>
                <strong style="color:#e4c070;font-family:'Courier New',monospace;">{{ number_format($order->total_amount, 0) }} EGP</strong>
            </div>

            <p style="margin:0 0 10px;line-height:1.8;">
                <strong>{{ $locale === 'en' ? 'Estimated delivery:' : 'التوصيل المتوقع:' }}</strong>
                {{ $deliveryText }}
            </p>

            <p style="margin:0 0 24px;line-height:1.8;">
                <a href="{{ $supportUrl }}" style="color:#e4c070;text-decoration:none;">
                    {{ $locale === 'en' ? 'Contact us on WhatsApp' : 'تواصل معنا عبر واتساب' }}
                </a>
            </p>

            <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08);color:rgba(242,234,216,.62);font-size:13px;line-height:1.8;">
                <strong style="display:block;color:#f2ead8;">نفَس | Nafas</strong>
                {{ $locale === 'en' ? 'An Arabic-first perfume house designed for calm, clear fragrance discovery.' : 'دار عطرية عربية أولًا، صُممت لتجعل اكتشاف الرائحة أهدأ وأوضح.' }}
            </div>
        </div>
    </div>
</body>
</html>
