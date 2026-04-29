import React from 'react';
import { cx } from './ui';

const MistLayer: React.FC<{ className?: string; intensity?: 'soft' | 'warm' | 'dense' }> = ({ className, intensity = 'soft' }) => (
  <div
    data-mist-layer
    aria-hidden="true"
    className={cx('nafas-mist', `nafas-mist--${intensity}`, className)}
  />
);

export default MistLayer;