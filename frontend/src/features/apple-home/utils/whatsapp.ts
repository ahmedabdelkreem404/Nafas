export const WHATSAPP_BASE_URL = String(import.meta.env.VITE_WHATSAPP_URL || '').trim();
export const HAS_WHATSAPP_URL = WHATSAPP_BASE_URL.startsWith('https://wa.me/') || WHATSAPP_BASE_URL.startsWith('https://api.whatsapp.com/');

export function buildWhatsappUrl(message: string, baseUrl = WHATSAPP_BASE_URL) {
  if (!baseUrl) {
    return '';
  }

  const encodedMessage = encodeURIComponent(message);

  if (/[?&]text=/.test(baseUrl)) {
    return baseUrl.replace(/([?&]text=)[^&]*/, `$1${encodedMessage}`);
  }

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}text=${encodedMessage}`;
}
