import React from 'react';
import './Card.css';

/**
 * Reusable Card component with glassmorphism styles and hover transitions.
 */
export default function Card({
  children,
  title,
  subtitle,
  glow = false,
  className = '',
  ...props
}) {
  return (
    <div className={`card-glass ${glow ? 'card-glow' : ''} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h2 className="card-title">{title}</h2>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
}
