import React from 'react';
import { cx } from './cx';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cx('ui-control', 'ui-select', className)} {...props}>{children}</select>
));
Select.displayName = 'Select';

export default Select;
