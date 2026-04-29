import React from 'react';

type PageHeaderProps = {
  actions?: React.ReactNode;
  description?: string;
  eyebrow?: string;
  title: string;
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  actions,
  description,
  eyebrow,
  title,
}) => (
  <div className="page-header">
    <div className="page-header__content">
      {eyebrow ? <span className="heading-eyebrow">{eyebrow}</span> : null}
      <h1 className="title page-header__title">{title}</h1>
      {description ? <p className="copy page-header__copy">{description}</p> : null}
    </div>
    {actions ? <div className="page-header__actions">{actions}</div> : null}
  </div>
);

export default PageHeader;
