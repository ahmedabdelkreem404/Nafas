import React from 'react';
import { cx } from './cx';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cx('ui-control', 'ui-textarea', className)} {...props} />
));
Textarea.displayName = 'Textarea';

export default Textarea;
