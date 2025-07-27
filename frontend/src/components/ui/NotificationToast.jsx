import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

const Toast = ({ 
  type = 'success', 
  message, 
  isVisible, 
  onClose,
  duration = 4000,
  className = ''
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      show ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
    } ${className}`}>
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4 max-w-sm`}>
        <div className="flex items-start space-x-3">
          <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} size={20} />
          <div className="flex-1">
            <p className={`${config.textColor} text-sm font-medium`}>
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setShow(false);
              onClose?.();
            }}
            className={`${config.textColor} hover:opacity-70 flex-shrink-0`}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;