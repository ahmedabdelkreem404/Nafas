// TODO: Replace with the final Nafas WhatsApp business number.
export const WHATSAPP_BASE_URL = 'https://wa.me/21007489872';

export function buildWhatsappUrl(message: string) {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}
