import React from 'react';

/**
 * Reusable accessible Table wrapper and components
 */
export const Table = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
      <table className={`w-full text-left text-sm border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className = '', ...props }) => {
  return (
    <thead className={`bg-surface-muted border-b border-border text-neutral-600 font-semibold text-xs uppercase tracking-wider ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className = '', ...props }) => {
  return (
    <tbody className={`divide-y divide-border text-neutral-800 ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className = '', hover = true, ...props }) => {
  return (
    <tr
      className={`transition-colors duration-150 ${hover ? 'hover:bg-neutral-50/80' : ''} ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = '', ...props }) => {
  return (
    <th
      scope="col"
      className={`px-4 py-3.5 text-xs font-semibold text-neutral-700 select-none whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ children, className = '', ...props }) => {
  return (
    <td
      className={`px-4 py-3.5 text-sm text-neutral-700 whitespace-nowrap align-middle ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};

export default Table;
