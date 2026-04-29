import React from 'react';
import type { Locale } from '../context/LocaleContext';
import { formatCurrency } from '../utils/format';

type CheckoutSummaryProps = {
  body?: string;
  cta?: React.ReactNode;
  itemsCount: number;
  locale: Locale;
  secondaryAction?: React.ReactNode;
  shippingLabel: string;
  subtotalLabel: string;
  title: string;
  total: number;
  totalLabel: string;
};

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  body,
  cta,
  itemsCount,
  locale,
  secondaryAction,
  shippingLabel,
  subtotalLabel,
  title,
  total,
  totalLabel,
}) => (
  <aside className="checkout-summary">
    <div className="checkout-summary__header">
      <strong>{title}</strong>
      {body ? <p>{body}</p> : null}
    </div>
    <div className="checkout-summary__rows">
      <div className="checkout-summary__row">
        <span>{subtotalLabel}</span>
        <strong>{formatCurrency(total, locale)}</strong>
      </div>
      <div className="checkout-summary__row">
        <span>{locale === 'ar' ? 'عدد القطع' : 'Items'}</span>
        <strong>{itemsCount}</strong>
      </div>
      <div className="checkout-summary__row">
        <span>{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
        <strong>{shippingLabel}</strong>
      </div>
    </div>
    <div className="checkout-summary__total">
      <span>{totalLabel}</span>
      <strong>{formatCurrency(total, locale)}</strong>
    </div>
    {cta}
    {secondaryAction}
  </aside>
);

export default CheckoutSummary;
