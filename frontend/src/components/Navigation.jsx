import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Gavel, Users, Trophy, User, Info } from 'lucide-react';
import AuthButtons from './auth/AuthButtons';

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
      {/* Enhanced Sport X Brand Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-4 px-4 shadow-lg">
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
          
          <button 
            onClick={() => navigate('/splash')}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 shadow-md"
          >
            <Info size={16} />
            <span className="text-sm font-semibold">About Sport X</span>
          </button>
        </div>
        
        {/* Tagline */}
        <div className="mt-2 text-center">
          <p className="text-xs text-blue-100 font-medium">
            Sports gaming with friends • No gambling. All game.
          </p>
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