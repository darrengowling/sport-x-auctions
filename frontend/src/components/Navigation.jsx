import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Gavel, Users, Trophy, User, Info } from 'lucide-react';
import AuthButtons from './auth/AuthButtons';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      path: '/home', 
      icon: Home, 
      label: 'Home',
      color: 'text-blue-500'
    },
    { 
      path: '/auctions', 
      icon: Gavel, 
      label: 'Auctions',
      color: 'text-purple-500'
    },
    { 
      path: '/teams', 
      icon: Users, 
      label: 'Teams',
      color: 'text-green-500'
    },
    { 
      path: '/leagues', 
      icon: Trophy, 
      label: 'Leagues',
      color: 'text-orange-500'
    },
    { 
      path: '/profile', 
      icon: User, 
      label: 'Profile',
      color: 'text-red-500'
    }
  ];

  return (
    <>
      {/* Desktop Navigation Header */}
      <div className="hidden sm:block bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/splash')}
              className="flex items-center space-x-3 hover:scale-105 transition-all duration-200 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-bold text-lg">SX</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg tracking-wide">Sport X</span>
                <span className="text-xs text-blue-200 leading-none font-medium">Pro Cricket Auctions</span>
              </div>
            </button>
            
            <div className="flex items-center space-x-3">
              <AuthButtons />
              <button 
                onClick={() => navigate('/splash')}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 shadow-md"
              >
                <Info size={16} />
                <span className="text-sm font-semibold hidden lg:inline">About Sport X</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="sm:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/splash')}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">SX</span>
            </div>
            <div>
              <span className="font-bold text-sm">Sport X</span>
              <div className="text-xs text-blue-200 leading-none">Pro Cricket Auctions</div>
            </div>
          </button>
          
          <div className="flex items-center space-x-2">
            <AuthButtons className="scale-90" />
          </div>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <div className="hidden sm:block bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-200 hover:scale-105 ${
                    isActive 
                      ? `border-blue-500 ${item.color}` 
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 touch-manipulation ${
                  isActive 
                    ? `${item.color} scale-110` 
                    : 'text-gray-500 hover:text-gray-700 active:scale-95'
                }`}
              >
                <Icon size={isActive ? 24 : 22} />
                <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-current rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="sm:hidden h-16"></div>
    </>
  );
};

export default Navigation;