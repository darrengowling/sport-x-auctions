// Sport X Design System - Cricket-focused with expansion capability
export const SPORT_X_THEME = {
  colors: {
    // Primary Sport X Colors (from specification)
    gold: '#FFD700',
    navy: '#1a1a2e', 
    blue: '#16213e',
    
    // Cricket-specific colors (primary focus)
    cricket: {
      primary: '#ff6b35',
      secondary: '#e55a2b',
      accent: '#ff8c42'
    },
    
    // UI Colors
    background: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      light: '#f8fafc',
      dark: '#0f172a'
    },
    
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      accent: '#FFD700',
      muted: '#64748b'
    },
    
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  
  gradients: {
    // Sport X signature gradients
    primary: 'from-yellow-400 via-yellow-500 to-yellow-600',
    hero: 'from-slate-900 via-blue-900 to-slate-800',
    cricket: 'from-orange-500 to-red-500',
    auction: 'from-purple-500 to-pink-500',
    success: 'from-green-500 to-emerald-600',
    premium: 'from-yellow-400 via-yellow-500 to-orange-500'
  },
  
  typography: {
    fontFamily: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, monospace'
    }
  },
  
  spacing: {
    touch: '44px', // Minimum touch target size for mobile
    section: '2rem',
    component: '1rem'
  },
  
  // Cricket-specific theming
  cricket: {
    positions: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
    leagues: ['IPL', 'BBL', 'CPL', 'PSL', 'The Hundred'],
    currencies: { primary: '£', secondary: '$' },
    bidding: {
      minBid: 1000000,
      increment: 1000000,
      maxBudget: 100000000
    }
  }
};

export default SPORT_X_THEME;