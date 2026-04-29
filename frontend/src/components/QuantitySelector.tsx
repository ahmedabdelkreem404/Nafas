import React from 'react';

type QuantitySelectorProps = {
  decrementLabel: string;
  incrementLabel: string;
  max?: number;
  min?: number;
  onChange: (nextQuantity: number) => void;
  value: number;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  decrementLabel,
  incrementLabel,
  max = 99,
  min = 1,
  onChange,
  value,
}) => (
  <div className="quantity-selector">
    <button type="button" className="quantity-selector__button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={decrementLabel}>
      −
    </button>
    <span className="quantity-selector__value">{value}</span>
    <button type="button" className="quantity-selector__button" onClick={() => onChange(Math.min(max, value + 1))} aria-label={incrementLabel}>
      +
    </button>
  </div>
);

export default QuantitySelector;
