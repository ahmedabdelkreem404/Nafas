// TODO: Replace with the final Nafas WhatsApp business number.
export const WHATSAPP_BASE_URL = 'https://wa.me/21007489872';

export function buildWhatsappUrl(message: string, baseUrl = WHATSAPP_BASE_URL) {
  const encodedMessage = encodeURIComponent(message);

  if (/[?&]text=/.test(baseUrl)) {
    return baseUrl.replace(/([?&]text=)[^&]*/, `$1${encodedMessage}`);
  }

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}text=${encodedMessage}`;
}
