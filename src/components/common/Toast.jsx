import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast = { id, title, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message, title = 'Success', options = {}) => addToast({ title, message, type: 'success', ...options }),
    error: (message, title = 'Error', options = {}) => addToast({ title, message, type: 'error', ...options }),
    warning: (message, title = 'Warning', options = {}) => addToast({ title, message, type: 'warning', ...options }),
    info: (message, title = 'Info', options = {}) => addToast({ title, message, type: 'info', ...options }),
    remove: removeToast,
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-success-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-error-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-600 shrink-0" />;
      default:
        return <Info className="h-5 w-5 text-primary-600 shrink-0" />;
    }
  };

  const getBgStyle = (type) => {
    switch (type) {
      case 'success':
        return 'border-success-500/20 bg-surface shadow-card';
      case 'error':
        return 'border-error-500/20 bg-surface shadow-card';
      case 'warning':
        return 'border-warning-500/20 bg-surface shadow-card';
      default:
        return 'border-primary-500/20 bg-surface shadow-card';
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="alert"
            className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-xl border
              transform transition-all duration-200 ease-out animate-in slide-in-from-bottom-2 fade-in
              ${getBgStyle(item.type)}
            `}
          >
            {getIcon(item.type)}
            <div className="flex-1 min-w-0">
              {item.title && (
                <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
                  {item.title}
                </h4>
              )}
              {item.message && (
                <p className="text-xs text-neutral-600 mt-0.5 break-words">
                  {item.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors focus:outline-none"
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
