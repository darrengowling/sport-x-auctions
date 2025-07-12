import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashPage from './SplashPage';

const SplashHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen splash before for first-time experience
    const hasSeenSplash = localStorage.getItem('sportx_splash_seen');
    
    // Only redirect if user has explicitly seen splash AND this is not a direct visit to root
    if (hasSeenSplash && window.location.pathname === '/') {
      // Small delay to show splash briefly, then redirect
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 1500);
    }
  }, [navigate]);

  return <SplashPage />;
};

export default SplashHandler;