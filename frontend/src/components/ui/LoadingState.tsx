import React from 'react';
import BrandLogo from '../BrandLogo';
import Card from './Card';

export const LoadingState: React.FC<{ label?: string; lines?: number }> = ({
  label = 'جارِ التحميل...',
  lines = 3,
}) => (
  <Card className="state-card">
    <BrandLogo variant="icon" className="state-card__brand" alt="Nafas icon" />
    <div className="stack">
      <div className="loading-bar loading-bar--lg" />
      {Array.from({ length: lines }).map((_, index) => <div key={index} className="loading-bar" />)}
    </div>
    <p className="copy copy-muted">{label}</p>
  </Card>
);

export default LoadingState;
