import React from 'react';
import BrandLogo from '../BrandLogo';
import Card from './Card';

export const EmptyState: React.FC<{
  action?: React.ReactNode;
  description: string;
  title: string;
}> = ({
  action,
  description,
  title,
}) => (
  <Card className="state-card state-card--empty">
    <BrandLogo variant="icon" className="state-icon state-icon--brand" alt="Nafas icon" />
    <h3 className="title state-card__title">{title}</h3>
    <p className="copy copy-muted">{description}</p>
    {action}
  </Card>
);

export default EmptyState;
