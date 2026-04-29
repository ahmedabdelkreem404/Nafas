import React from 'react';
import { BRAND_ICON, BRAND_ICON_FALLBACK, BRAND_LOGO, BRAND_LOGO_FALLBACK } from '../utils/brand';

type Variant = 'logo' | 'icon';

const BrandLogo: React.FC<{
  variant?: Variant;
  className?: string;
  alt?: string;
}> = ({ variant = 'logo', className, alt = 'Nafas brand mark' }) => {
  const webp = variant === 'logo' ? BRAND_LOGO : BRAND_ICON;
  const jpeg = variant === 'logo' ? BRAND_LOGO_FALLBACK : BRAND_ICON_FALLBACK;

  return (
    <picture className={className}>
      <source srcSet={webp} type="image/webp" />
      <img src={jpeg} alt={alt} loading="eager" decoding="async" />
    </picture>
  );
};

export default BrandLogo;

