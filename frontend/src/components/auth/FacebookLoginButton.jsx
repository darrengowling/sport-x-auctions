import React from 'react';
import { Button } from '../ui/button';

const FacebookLoginButton = ({ onSuccess, disabled = false }) => {
  const handleFacebookLogin = () => {
    // For now, simulate Facebook login
    // In production, this would integrate with Facebook SDK
    const mockFacebookUser = {
      id: 'fb_' + Math.random().toString(36).substr(2, 9),
      email: 'user@facebook.com',
      firstName: 'Facebook',
      lastName: 'User',
      avatar: 'https://via.placeholder.com/100',
      provider: 'facebook'
    };
    
    onSuccess(mockFacebookUser);
  };

  return (
    <Button
      onClick={handleFacebookLogin}
      disabled={disabled}
      variant="outline"
      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 py-3"
    >
      <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      Continue with Facebook
    </Button>
  );
};

export default FacebookLoginButton;