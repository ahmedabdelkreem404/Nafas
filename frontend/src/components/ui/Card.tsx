import React from 'react';
import { cx } from './cx';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: 'default' | 'strong' | 'soft';
  padded?: boolean;
};

export const Card: React.FC<CardProps> = ({ tone = 'default', padded = true, className, ...props }) => (
  <div className={cx('ui-card', `ui-card--${tone}`, padded && 'ui-card--padded', className)} {...props} />
);

export default Card;
