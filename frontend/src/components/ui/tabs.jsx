import React from 'react';

const Tabs = ({ value, onValueChange, className, children }) => {
  return (
    <div className={className} data-value={value}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab: value, onTabChange: onValueChange })
      )}
    </div>
  );
};

const TabsList = ({ children, className, activeTab, onTabChange }) => {
  return (
    <div className={className}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, onTabChange })
      )}
    </div>
  );
};

const TabsTrigger = ({ value, className, children, activeTab, onTabChange }) => {
  const isActive = activeTab === value;
  
  return (
    <button
      className={`${className} ${isActive ? 'data-[state=active]' : ''}`}
      onClick={() => onTabChange(value)}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, activeTab }) => {
  if (activeTab !== value) return null;
  
  return <div>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };