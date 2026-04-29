export const buildCheckoutPayload = (form: Record<string, unknown>, items: Array<{ variant: { id: number }; quantity: number }>) => ({
  ...form,
  payment_method: form.payment_method === 'cod' ? 'cash_on_delivery' : form.payment_method,
  items: items.map((item) => ({ variant_id: item.variant.id, quantity: item.quantity })),
});
