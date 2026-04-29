import React from 'react';
import { cx } from './cx';

type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  error?: string;
  hint?: string;
  htmlFor?: string;
  label?: string;
};

export const Field: React.FC<FieldProps> = ({
  children,
  className,
  error,
  hint,
  htmlFor,
  label,
  ...props
}) => (
  <div className={cx('ui-field', className)} {...props}>
    {label ? <label className="ui-label" htmlFor={htmlFor}>{label}</label> : null}
    {children}
    {error ? <div className="ui-field-message ui-field-message--error">{error}</div> : hint ? <div className="ui-field-message">{hint}</div> : null}
  </div>
);

export default Field;
