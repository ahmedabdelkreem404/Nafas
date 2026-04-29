import React from 'react';
import { cx } from './cx';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'secondary';
};

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  className,
  label,
  size = 'md',
  type = 'button',
  variant = 'ghost',
  ...props
}) => (
  <button
    aria-label={label}
    className={cx('ui-icon-button', `ui-icon-button--${variant}`, `ui-icon-button--${size}`, className)}
    type={type}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
