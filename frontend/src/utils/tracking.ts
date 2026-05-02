const GA_ID = (import.meta.env.VITE_GA4_ID || import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim();
const TIKTOK_PIXEL_ID = import.meta.env.VITE_TIKTOK_PIXEL_ID?.trim();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      load?: (id: string) => void;
      page?: () => void;
      track?: (event: string, payload?: Record<string, unknown>) => void;
    };
  }
}

export const trackingConfig = {
  gaEnabled: Boolean(GA_ID),
  metaPixelEnabled: Boolean(META_PIXEL_ID),
  tiktokPixelEnabled: Boolean(TIKTOK_PIXEL_ID),
};

let trackingInitialized = false;

function appendScript(id: string, src: string) {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function initTracking() {
  if (trackingInitialized) {
    return;
  }

  trackingInitialized = true;

  if (GA_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: false });
    appendScript('nafas-ga', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`);
  }

  if (META_PIXEL_ID) {
    window.fbq = window.fbq || ((...args: unknown[]) => {
      const queuedFbq = window.fbq as unknown as { queue?: unknown[] };
      queuedFbq.queue = queuedFbq.queue || [];
      queuedFbq.queue.push(args);
    });
    window.fbq('init', META_PIXEL_ID);
    appendScript('nafas-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');
  }

  if (TIKTOK_PIXEL_ID) {
    window.ttq = window.ttq || {};
    appendScript('nafas-tiktok-pixel', 'https://analytics.tiktok.com/i18n/pixel/events.js');
    window.ttq.load?.(TIKTOK_PIXEL_ID);
  }
}

export function trackPageView(path: string) {
  if (GA_ID && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      send_to: GA_ID,
    });
  }

  if (META_PIXEL_ID && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }

  window.ttq?.page?.();
}

type CommercePayload = {
  currency?: string;
  value?: number;
  productId?: number | string;
  productName?: string;
  couponCode?: string;
  orderNumber?: string;
  path?: string;
};

function trackGaEvent(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  }
}

function trackMetaEvent(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', name, payload);
  }
}

function trackTiktokEvent(name: string, payload: Record<string, unknown> = {}) {
  window.ttq?.track?.(name, payload);
}

export function trackViewContent(payload: CommercePayload = {}) {
  const eventPayload = {
    currency: payload.currency || 'EGP',
    value: payload.value,
    content_id: payload.productId,
    content_name: payload.productName,
  };
  trackGaEvent('view_item', eventPayload);
  trackMetaEvent('ViewContent', eventPayload);
  trackTiktokEvent('ViewContent', eventPayload);
}

export function trackAddToCart(payload: CommercePayload = {}) {
  const eventPayload = {
    currency: payload.currency || 'EGP',
    value: payload.value,
    content_id: payload.productId,
    content_name: payload.productName,
  };
  trackGaEvent('add_to_cart', eventPayload);
  trackMetaEvent('AddToCart', eventPayload);
  trackTiktokEvent('AddToCart', eventPayload);
}

export function trackInitiateCheckout(total: number) {
  const payload = {
    currency: 'EGP',
    value: total,
  };
  trackGaEvent('begin_checkout', payload);
  trackMetaEvent('InitiateCheckout', payload);
  trackTiktokEvent('InitiateCheckout', payload);
}

export function trackCheckoutStarted(total: number) {
  trackInitiateCheckout(total);
}

export function trackOrderCreated(payload: CommercePayload = {}) {
  const eventPayload = {
    currency: payload.currency || 'EGP',
    value: payload.value,
    transaction_id: payload.orderNumber,
  };
  trackGaEvent('purchase', eventPayload);
  trackMetaEvent('Purchase', eventPayload);
  trackTiktokEvent('CompletePayment', eventPayload);
}

export function trackPurchase(payload: CommercePayload = {}) {
  trackOrderCreated(payload);
}

export function trackContactWhatsApp(payload: CommercePayload = {}) {
  trackGaEvent('contact_whatsapp', { path: payload.path });
  trackMetaEvent('Contact', { path: payload.path });
  trackTiktokEvent('Contact', { path: payload.path });
}

export function trackCouponEntered(payload: CommercePayload = {}) {
  trackGaEvent('coupon_entered', { coupon_code: payload.couponCode });
  trackTiktokEvent('ClickButton', { coupon_code: payload.couponCode });
}
