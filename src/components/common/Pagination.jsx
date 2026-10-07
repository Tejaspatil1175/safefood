import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Accessible Pagination Component
 */
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // Number of pages to show on either side of current page

    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = itemsPerPage && totalItems ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = itemsPerPage && totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 ${className}`}
    >
      {totalItems !== undefined && (
        <p className="text-xs text-neutral-500">
          {startItem && endItem ? (
            <>
              Showing <span className="font-medium text-neutral-800">{startItem}</span> to{' '}
              <span className="font-medium text-neutral-800">{endItem}</span> of{' '}
              <span className="font-medium text-neutral-800">{totalItems}</span> results
            </>
          ) : (
            <>
              Total <span className="font-medium text-neutral-800">{totalItems}</span> items
            </>
          )}
        </p>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-surface text-neutral-700 hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-neutral-400 select-none"
                >
                  …
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange && onPageChange(p)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`h-8 w-8 text-xs font-semibold rounded-lg flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface text-neutral-600 hover:bg-surface-muted hover:text-neutral-900 border border-transparent hover:border-border'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-surface text-neutral-700 hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
