// Enhanced Cricket Data - Sport X focused with community features
export const CRICKET_CONFIG = {
  sport: {
    id: 'cricket',
    name: 'Cricket',
    displayName: 'Cricket Auctions',
    icon: '🏏',
    description: 'Own cricket legends and build championship teams through strategic bidding'
  },
  
  leagues: [
    {
      id: 'ipl',
      name: 'IPL',
      fullName: 'Indian Premier League',
      season: '2024',
      status: 'active',
      teams: 10,
      icon: '🏆'
    },
    {
      id: 'bbl',
      name: 'BBL', 
      fullName: 'Big Bash League',
      season: '2024',
      status: 'active',
      teams: 8,
      icon: '🏏'
    },
    {
      id: 'cpl',
      name: 'CPL',
      fullName: 'Caribbean Premier League', 
      season: '2024',
      status: 'upcoming',
      teams: 6,
      icon: '🌴'
    },
    {
      id: 'psl',
      name: 'PSL',
      fullName: 'Pakistan Super League',
      season: '2024', 
      status: 'completed',
      teams: 6,
      icon: '⭐'
    },
    {
      id: 'hundred',
      name: 'The Hundred',
      fullName: 'The Hundred',
      season: '2024',
      status: 'upcoming', 
      teams: 8,
      icon: '💯'
    }
  ],
  
  positions: [
    { id: 'batsman', name: 'Batsman', icon: '🏏', color: '#ef4444' },
    { id: 'bowler', name: 'Bowler', icon: '⚡', color: '#3b82f6' },
    { id: 'allrounder', name: 'All-rounder', icon: '⭐', color: '#8b5cf6' },
    { id: 'wicketkeeper', name: 'Wicket-keeper', icon: '🧤', color: '#10b981' }
  ],
  
  auction: {
    currency: '£',
    minBid: 1000000,
    bidIncrement: 1000000,
    maxBudget: 100000000,
    auctionDuration: 300, // 5 minutes
    maxPlayersPerTeam: 15,
    minPlayersPerTeam: 11
  }
};

// Enhanced Cricket Players with community features
export const ENHANCED_CRICKET_PLAYERS = [
  {
    id: 'player-1',
    name: 'Virat Kohli',
    team: 'Royal Challengers Bangalore',
    shortTeam: 'RCB',
    position: 'batsman',
    nationality: 'India',
    age: 35,
    experience: '15 years',
    currentBid: 15000000,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    
    // Performance Stats
    stats: {
      matches: 237,
      runs: 7263,
      average: 37.25,
      strikeRate: 130.41,
      centuries: 7,
      fifties: 50
    },
    
    // Community Features
    rating: 95,
    popularity: 98,
    bidders: ['SportsFan1', 'CricketKing', 'BidMaster99'],
    totalBids: 47,
    lastBidTime: '2 minutes ago',
    
    // Social Features
    followers: 12500,
    mentions: 450,
    trending: true,
    hotPlayer: true,
    
    // Additional Info
    leagues: ['IPL', 'BBL'],
    achievements: ['Padma Shri', 'ICC ODI Player of the Year'],
    marketTrend: 'rising'
  },
  
  {
    id: 'player-2',
    name: 'MS Dhoni',
    team: 'Chennai Super Kings',
    shortTeam: 'CSK',
    position: 'wicketkeeper',
    nationality: 'India',
    age: 42,
    experience: '18 years',
    currentBid: 12000000,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    
    stats: {
      matches: 234,
      runs: 4978,
      average: 39.65,
      strikeRate: 135.92,
      centuries: 0,
      fifties: 24
    },
    
    rating: 92,
    popularity: 96,
    bidders: ['DHONIFan', 'WicketMaster', 'TeamCaptain'],
    totalBids: 38,
    lastBidTime: '5 minutes ago',
    
    followers: 15200,
    mentions: 380,
    trending: true,
    hotPlayer: true,
    
    leagues: ['IPL'],
    achievements: ['World Cup Winner', 'IPL Champion'],
    marketTrend: 'stable'
  },
  
  {
    id: 'player-3',
    name: 'Jasprit Bumrah',
    team: 'Mumbai Indians', 
    shortTeam: 'MI',
    position: 'bowler',
    nationality: 'India',
    age: 30,
    experience: '8 years',
    currentBid: 14000000,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
    
    stats: {
      matches: 120,
      wickets: 165,
      average: 24.43,
      economy: 7.39,
      bestFigures: '5/10',
      hatTricks: 1
    },
    
    rating: 94,
    popularity: 88,
    bidders: ['FastBowler', 'MumbaiLover', 'BumrahFan'],
    totalBids: 29,
    lastBidTime: '8 minutes ago',
    
    followers: 8900,
    mentions: 290,
    trending: false,
    hotPlayer: false,
    
    leagues: ['IPL', 'BBL'],
    achievements: ['Purple Cap Winner', 'ICC Rankings #1'],
    marketTrend: 'rising'
  },
  
  {
    id: 'player-4',
    name: 'Andre Russell',
    team: 'Kolkata Knight Riders',
    shortTeam: 'KKR', 
    position: 'allrounder',
    nationality: 'West Indies',
    age: 35,
    experience: '12 years',
    currentBid: 11000000,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    
    stats: {
      matches: 140,
      runs: 2556,
      average: 29.95,
      strikeRate: 179.55,
      wickets: 77,
      economy: 9.52
    },
    
    rating: 89,
    popularity: 85,
    bidders: ['PowerHitter', 'AllRounderKing', 'WestIndiesFan'],
    totalBids: 22,
    lastBidTime: '12 minutes ago',
    
    followers: 6400,
    mentions: 180,
    trending: false,
    hotPlayer: false,
    
    leagues: ['IPL', 'CPL', 'BBL'],
    achievements: ['Fastest IPL Fifty', 'CPL Champion'],
    marketTrend: 'falling'
  },
  
  {
    id: 'player-5',
    name: 'David Warner',
    team: 'Delhi Capitals',
    shortTeam: 'DC',
    position: 'batsman',
    nationality: 'Australia', 
    age: 37,
    experience: '13 years',
    currentBid: 9500000,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
    
    stats: {
      matches: 162,
      runs: 6397,
      average: 41.81,
      strikeRate: 139.96,
      centuries: 4,
      fifties: 54
    },
    
    rating: 87,
    popularity: 82,
    bidders: ['AussieKing', 'OpenerSpecial', 'WarnerFan'],
    totalBids: 18,
    lastBidTime: '15 minutes ago',
    
    followers: 5800,
    mentions: 150,
    trending: false,
    hotPlayer: false,
    
    leagues: ['IPL', 'BBL'],
    achievements: ['Orange Cap Winner', 'BBL Champion'],
    marketTrend: 'stable'
  }
];

// Community Features Data
export const COMMUNITY_FEATURES = {
  leaderboards: {
    topBidders: [
      { rank: 1, user: 'CricketKing', totalBids: 156, totalSpent: 45000000, winRate: 78 },
      { rank: 2, user: 'BidMaster99', totalBids: 142, totalSpent: 41000000, winRate: 72 },
      { rank: 3, user: 'SportsFan1', totalBids: 134, totalSpent: 38000000, winRate: 69 },
      { rank: 4, user: 'DHONIFan', totalBids: 128, totalSpent: 36000000, winRate: 65 },
      { rank: 5, user: 'TeamCaptain', totalBids: 119, totalSpent: 33000000, winRate: 71 }
    ],
    
    topPerformers: [
      { rank: 1, user: 'CricketKing', points: 8950, teamsWon: 12, avgScore: 745 },
      { rank: 2, user: 'BidMaster99', points: 8720, teamsWon: 11, avgScore: 726 },
      { rank: 3, user: 'SportsFan1', points: 8440, teamsWon: 10, avgScore: 704 },
      { rank: 4, user: 'PowerHitter', points: 8290, teamsWon: 9, avgScore: 691 },
      { rank: 5, user: 'AllRounderKing', points: 8150, teamsWon: 9, avgScore: 679 }
    ]
  },
  
  socialActivity: {
    recentBids: [
      { user: 'CricketKing', player: 'Virat Kohli', amount: 15000000, time: '2 min ago' },
      { user: 'DHONIFan', player: 'MS Dhoni', amount: 12000000, time: '5 min ago' },
      { user: 'BidMaster99', player: 'Jasprit Bumrah', amount: 14000000, time: '8 min ago' }
    ],
    
    trending: [
      { topic: '#ViratKohli', mentions: 450, trend: 'rising' },
      { topic: '#MSDhoni', mentions: 380, trend: 'stable' },
      { topic: '#IPL2024', mentions: 920, trend: 'rising' }
    ]
  }
};

export { CRICKET_CONFIG as default };