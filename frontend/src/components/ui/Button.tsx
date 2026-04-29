import React from 'react';
import { cx } from './cx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

const baseClass = 'ui-button';

export const Button: React.FC<ButtonProps> = ({
  className,
  fullWidth,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}) => (
  <button
    className={cx(
      baseClass,
      `${baseClass}--${variant}`,
      `${baseClass}--${size}`,
      fullWidth && `${baseClass}--full`,
      className,
    )}
    type={type}
    {...props}
  />
);

export default Button;
