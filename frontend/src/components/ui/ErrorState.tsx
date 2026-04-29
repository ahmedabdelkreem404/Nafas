import React from 'react';
import Card from './Card';

export const ErrorState: React.FC<{
  action?: React.ReactNode;
  message: string;
  title?: string;
}> = ({
  action,
  message,
  title = 'تعذّر تحميل البيانات',
}) => (
  <Card className="state-card state-card--error">
    <div className="state-icon">!</div>
    <h3 className="title state-card__title">{title}</h3>
    <p className="copy copy-muted">{message}</p>
    {action}
  </Card>
);

export default ErrorState;
