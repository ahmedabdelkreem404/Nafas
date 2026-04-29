import React from 'react';
import PageHeader from './PageHeader';

export const AdminPageShell: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ eyebrow, title, description, actions, children }) => (
  <div className="admin-page-shell stack">
    <PageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
    <div className="stack">{children}</div>
  </div>
);

export default AdminPageShell;
