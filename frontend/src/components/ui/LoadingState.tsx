import React from 'react';
import BrandLogo from '../BrandLogo';
import Card from './Card';

export const LoadingState: React.FC<{ label?: string; lines?: number }> = ({
  label = 'جارِ التحميل...',
  lines = 3,
}) => {
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="admin-loading-state" aria-label={label} role="status">
        <div className="admin-loading-state__head">
          <span>{label}</span>
          <div className="loading-bar loading-bar--lg" />
        </div>
        <div className="admin-loading-state__grid">
          {Array.from({ length: Math.max(lines, 3) }).map((_, index) => (
            <div key={index} className="admin-skeleton-card">
              <div className="loading-bar" />
              <div className="loading-bar loading-bar--lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="state-card">
      <BrandLogo variant="icon" className="state-card__brand" alt="Nafas icon" />
      <div className="stack">
        <div className="loading-bar loading-bar--lg" />
        {Array.from({ length: lines }).map((_, index) => <div key={index} className="loading-bar" />)}
      </div>
      <p className="copy copy-muted">{label}</p>
    </Card>
  );
};

export default LoadingState;
