export const buildCheckoutPayload = (form: Record<string, unknown>, items: Array<{ variant: { id: number }; quantity: number }>) => ({
  ...form,
  items: items.map((item) => ({ variant_id: item.variant.id, quantity: item.quantity })),
});
