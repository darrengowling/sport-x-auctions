import React from 'react';
import SplashPage from './SplashPage';

const SplashHandler = () => {
  // Always show splash page for root route - no automatic redirects
  // Users must explicitly choose to enter the app
  return <SplashPage />;
};

export default SplashHandler;