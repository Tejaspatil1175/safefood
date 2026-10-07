/**
 * Display formatting utilities for TrustLabel
 */

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    }).format(date);
  } catch {
    return String(dateString);
  }
};

export const formatDateTime = (dateString) => {
  return formatDate(dateString, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

export const formatRoleLabel = (role) => {
  switch (String(role).toUpperCase()) {
    case 'ADMIN':
      return 'Administrator';
    case 'OFFICER':
      return 'Enforcement Officer';
    case 'USER':
    default:
      return 'Consumer';
  }
};

export const getStatusBadgeStyle = (status) => {
  switch (String(status).toUpperCase()) {
    case 'COMPLIANT':
    case 'RESOLVED':
    case 'ACTIVE':
    case 'APPROVED':
      return 'badge-success';
    case 'PARTIALLY_COMPLIANT':
    case 'UNDER_REVIEW':
    case 'PENDING':
    case 'WARNING':
      return 'badge-warning';
    case 'NON_COMPLIANT':
    case 'VIOLATION':
    case 'REJECTED':
    case 'CRITICAL':
    case 'NOTICE_ISSUED':
      return 'badge-error';
    default:
      return 'badge-primary';
  }
};
