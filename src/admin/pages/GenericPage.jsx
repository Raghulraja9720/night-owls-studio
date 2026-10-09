import React from 'react';

export default function GenericPage({ title }) {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{title}</h1>
      </div>
      <div className="admin-card">
        <p style={{ color: 'var(--admin-text-muted)' }}>This module is under construction.</p>
      </div>
    </div>
  );
}
