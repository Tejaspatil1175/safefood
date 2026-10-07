import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-surface border border-border rounded-xl p-6 shadow-card ${hover ? 'hover:shadow-card-hover hover:border-neutral-300 transition-all duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between mb-4 ${className}`}>
    <div>
      {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
      {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default Card;
