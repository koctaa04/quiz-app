import React from 'react';
import './Button.css';

/**
 * Reusable premium Button component with micro-animations.
 * Supports primary, secondary, outline, and state-based styling.
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary | secondary | outline | success | error
  disabled = false,
  isLoading = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`btn btn-${variant} ${isLoading ? 'btn-loading' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner-container">
          <span className="btn-spinner"></span>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
