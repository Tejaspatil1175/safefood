import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '', message }) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <div
        className={`${sizeMap[size] || sizeMap.md} animate-spin rounded-full border-2 border-neutral-200 border-t-primary`}
      />
      {message && <p className="text-sm text-neutral-500 font-medium animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
