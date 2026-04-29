import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { WHATSAPP_SUPPORT_URL } from '../utils/brand';

export default function WhatsAppFloatButton() {
  const { isOpen } = useCart();
  const location = useLocation();

  if (isOpen || location.pathname === '/') {
    return null;
  }

  return (
    <a
      className="whatsapp-float"
      href={WHATSAPP_SUPPORT_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp support"
    >
      <span className="whatsapp-float__pulse" aria-hidden="true" />
      <MessageCircle size={22} />
      <span className="whatsapp-float__tooltip">تحدث معنا على واتساب</span>
    </a>
  );
}
