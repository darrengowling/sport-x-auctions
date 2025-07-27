// Sport X Design System - Enhanced color palette and theming
export const SPORT_X_THEME = {
  colors: {
    // Primary Sport X Colors
    gold: '#FFD700',
    navy: '#1a1a2e', 
    blue: '#16213e',
    
    // Sport-specific colors
    sports: {
      cricket: '#ff6b35',
      nfl: '#013369',
      nba: '#c8102e', 
      rugby: '#006847',
      tennis: '#006bb6',
      golf: '#228b22'
    },
    
    // UI Colors
    background: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      light: '#f8fafc'
    },
    
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      accent: '#FFD700'
    },
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  
  gradients: {
    primary: 'from-yellow-400 via-yellow-500 to-yellow-600',
    sport: 'from-slate-900 via-blue-900 to-slate-800',
    auction: 'from-purple-500 to-pink-500',
    success: 'from-green-500 to-emerald-600'
  },
  
  typography: {
    fontFamily: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    },
    fontWeight: {
      normal: '400',
      medium: '500', 
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  },
  
  spacing: {
    touch: '44px', // Minimum touch target size
    section: '2rem',
    component: '1rem'
  }
};

export default SPORT_X_THEME;