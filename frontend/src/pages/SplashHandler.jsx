import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashPage from './SplashPage';

const SplashHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen splash before
    const hasSeenSplash = localStorage.getItem('sportx_splash_seen');
    if (hasSeenSplash) {
      // If user has seen splash, redirect to home
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const handleSplashComplete = () => {
    localStorage.setItem('sportx_splash_seen', 'true');
    navigate('/home', { replace: true });
  };

  return (
    <div onClick={handleSplashComplete}>
      <SplashPage onComplete={handleSplashComplete} />
    </div>
  );
};

export default SplashHandler;