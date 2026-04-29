import React from 'react';
import { cx } from './cx';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cx('ui-control', className)} {...props} />
));
Input.displayName = 'Input';

export default Input;
