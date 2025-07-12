import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashPage from './SplashPage';

const SplashHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen splash before for first-time experience
    const hasSeenSplash = localStorage.getItem('sportx_splash_seen');
    if (hasSeenSplash) {
      // If user has seen splash, redirect to home for first load only
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  return <SplashPage />;
};

export default SplashHandler;