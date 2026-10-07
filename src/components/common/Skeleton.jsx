import React from 'react';

/**
 * Shimmer Skeleton loaders
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200/80 ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2.5 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`p-6 rounded-xl border border-border bg-surface shadow-card space-y-4 ${className}`} aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-border bg-surface ${className}`} aria-hidden="true">
      <div className="p-4 border-b border-border bg-surface-muted flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`head-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`row-${r}`} className="p-4 flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={`cell-${r}-${c}`} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
