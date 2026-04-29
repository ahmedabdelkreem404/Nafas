import React from 'react';
import { cx } from './cx';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'gold' | 'success' | 'danger' | 'muted' | 'rose';
};

export const Badge: React.FC<BadgeProps> = ({ tone = 'gold', className, ...props }) => (
  <span className={cx('ui-badge', `ui-badge--${tone}`, className)} {...props} />
);

export default Badge;
