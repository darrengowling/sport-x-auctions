import React from 'react';
import { Button } from './button';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        {Icon && (
          <div className="mb-6">
            <Icon className="mx-auto text-gray-400 mb-4" size={64} />
          </div>
        )}
        
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
        
        {actionText && onAction && (
          <Button 
            onClick={onAction}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg"
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;