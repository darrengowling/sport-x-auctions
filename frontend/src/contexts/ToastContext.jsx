import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', duration = 4000) => {
    setToast({ message, type, duration, id: Date.now() });
  };

  const hideToast = () => {
    setToast(null);
  };

  const showSuccess = (message) => showToast(message, 'success');
  const showError = (message) => showToast(message, 'error');
  const showWarning = (message) => showToast(message, 'warning');

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning }}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          isVisible={!!toast}
          onClose={hideToast}
          duration={toast.duration}
        />
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;