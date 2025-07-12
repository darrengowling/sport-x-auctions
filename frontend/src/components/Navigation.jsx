import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Gavel, Users, Trophy, User, Info } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Gavel, label: 'Auctions', path: '/auctions' },
    { icon: Users, label: 'Teams', path: '/teams' },
    { icon: Trophy, label: 'Leagues', path: '/leagues' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      {/* Sport X Brand Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/splash')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">SX</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-sm">Sport X</span>
              <span className="text-xs text-blue-200 leading-none">Sports gaming with friends</span>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/splash')}
            className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
          >
            <Info size={14} />
            <span className="text-xs font-medium">About</span>
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-600' : ''} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;