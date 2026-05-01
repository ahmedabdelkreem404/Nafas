import type { Order, OrderItem, Product, Variant } from '../types/store';
import { toProduct } from './products';

function toNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeOrderItem(item: any): OrderItem {
  const variant = (item?.variant || null) as Variant | null;
  const rawProduct = item?.product || item?.variant?.product || null;
  const product = rawProduct ? (toProduct(rawProduct) as Product) : null;
  const quantity = toNumber(item?.quantity || 0);
  const unitPrice = toNumber(item?.unit_price || item?.snapshot_price || variant?.retail_price || 0);

  return {
    ...item,
    product,
    product_name: item?.product_name || product?.name_ar || product?.name_en,
    quantity,
    total_price: toNumber(item?.total_price || (unitPrice * quantity)),
    unit_price: unitPrice,
    variant,
    variant_label: item?.variant_label || variant?.label,
  };
}

export function normalizeOrder(order: any): Order {
  return {
    ...order,
    address: order?.address || '',
    city: order?.city || '',
    created_at: order?.created_at,
    customer_name: order?.customer_name || order?.name || '',
    delivery_notes: order?.delivery_notes || '',
    email: order?.email || order?.customer_email || '',
    governorate: order?.governorate || '',
    id: order?.id,
    items: Array.isArray(order?.items) ? order.items.map(normalizeOrderItem) : [],
    order_number: order?.order_number,
    payment: order?.payment || null,
    phone: order?.phone || order?.customer_phone || '',
    status: order?.status || '',
    total: toNumber(order?.total ?? order?.total_amount ?? 0),
  };
}

export function normalizeOrders(payload: unknown): Order[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map(normalizeOrder);
}
