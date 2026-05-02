export const PAYMENT_PROOF_MAX_BYTES = 3 * 1024 * 1024;
export const PAYMENT_PROOF_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validatePaymentProof(file: File | null | undefined, locale: 'ar' | 'en' = 'ar') {
  if (!file) {
    return '';
  }

  if (!PAYMENT_PROOF_ACCEPTED_TYPES.includes(file.type)) {
    return locale === 'ar'
      ? 'ارفع صورة بصيغة JPG أو PNG أو WEBP فقط.'
      : 'Upload a JPG, PNG, or WEBP image only.';
  }

  if (file.size > PAYMENT_PROOF_MAX_BYTES) {
    return locale === 'ar'
      ? 'حجم صورة إثبات الدفع يجب ألا يتجاوز 3MB.'
      : 'Payment proof image must be 3MB or smaller.';
  }

  return '';
}

export const buildCheckoutPayload = (form: Record<string, unknown>, items: Array<{ variant: { id: number }; quantity: number }>) => {
  const normalizedItems = items.map((item) => ({ variant_id: item.variant.id, quantity: item.quantity }));
  const paymentProof = form.payment_proof;

  if (paymentProof instanceof File) {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === 'payment_proof') {
        return;
      }

      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });

    normalizedItems.forEach((item, index) => {
      formData.append(`items[${index}][variant_id]`, String(item.variant_id));
      formData.append(`items[${index}][quantity]`, String(item.quantity));
    });
    formData.append('payment_proof', paymentProof);

    return formData;
  }

  return {
    ...Object.fromEntries(Object.entries(form).filter(([key, value]) => key !== 'payment_proof' && value !== '')),
    items: normalizedItems,
  };
};
