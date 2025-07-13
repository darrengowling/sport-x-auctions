import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { User, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const AuthButtons = ({ className = '' }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex items-center space-x-2">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.firstName || user.name} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="text-white font-medium hidden sm:block">
            {user.firstName || user.name || 'User'}
          </span>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <LogOut className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          onClick={() => setShowLoginModal(true)}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Sign In
        </Button>
        <Button
          onClick={() => setShowRegisterModal(true)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Sign Up
        </Button>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};

export default AuthButtons;