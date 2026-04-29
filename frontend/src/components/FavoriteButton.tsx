import React from 'react';
import { Heart } from 'lucide-react';
import { cx } from './ui';

type FavoriteButtonProps = {
  active?: boolean;
  className?: string;
  count?: number;
  label: string;
  onClick: () => void;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ active = false, className, count, label, onClick }) => (
  <button
    type="button"
    className={cx('favorite-button', active && 'is-active', className)}
    aria-label={label}
    aria-pressed={active}
    onClick={onClick}
  >
    <Heart size={18} fill={active ? 'currentColor' : 'none'} />
    {typeof count === 'number' ? <span>{count}</span> : null}
  </button>
);

export default FavoriteButton;

