// Multi-Sport Data Structure and Configuration
export const SPORTS_CONFIG = {
  cricket: {
    id: 'cricket',
    name: 'Cricket',
    displayName: 'Cricket',
    icon: '🏏',
    color: '#ff6b35',
    gradient: 'from-orange-500 to-red-500',
    description: 'Bid on cricket stars and build your ultimate team',
    positions: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
    leagues: ['IPL', 'BBL', 'CPL', 'PSL'],
    season: 'Active',
    playerCount: 150
  },
  
  nfl: {
    id: 'nfl',
    name: 'NFL',
    displayName: 'American Football',
    icon: '🏈',
    color: '#013369',
    gradient: 'from-blue-900 to-blue-700',
    description: 'Draft NFL superstars and dominate the gridiron',
    positions: ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'],
    leagues: ['NFL Regular Season', 'NFL Playoffs'],
    season: 'Active',
    playerCount: 200
  },
  
  nba: {
    id: 'nba',
    name: 'NBA',
    displayName: 'Basketball',
    icon: '🏀',
    color: '#c8102e',
    gradient: 'from-red-600 to-red-800',
    description: 'Own basketball legends and rule the court',
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    leagues: ['NBA Regular Season', 'NBA Playoffs'],
    season: 'Active',
    playerCount: 180
  },
  
  rugby: {
    id: 'rugby',
    name: 'Rugby',
    displayName: 'Rugby',
    icon: '🏉',
    color: '#006847',
    gradient: 'from-green-700 to-green-900',
    description: 'Secure rugby warriors and conquer the pitch',
    positions: ['Forward', 'Back', 'Scrum-half', 'Fly-half'],
    leagues: ['Six Nations', 'Rugby World Cup'],
    season: 'Off-season',
    playerCount: 120
  },
  
  tennis: {
    id: 'tennis',
    name: 'Tennis',
    displayName: 'Tennis',
    icon: '🎾',
    color: '#006bb6',
    gradient: 'from-blue-600 to-blue-800',
    description: 'Acquire tennis aces and ace the competition',
    positions: ['Singles Player', 'Doubles Specialist'],
    leagues: ['Grand Slam', 'ATP Tour', 'WTA Tour'],
    season: 'Active',
    playerCount: 100
  },
  
  golf: {
    id: 'golf',
    name: 'Golf',
    displayName: 'Golf',
    icon: '⛳',
    color: '#228b22',
    gradient: 'from-green-600 to-green-800',
    description: 'Invest in golf masters and drive to victory',
    positions: ['Professional Golfer'],
    leagues: ['PGA Tour', 'Masters', 'The Open'],
    season: 'Active',
    playerCount: 80
  }
};

// Enhanced player data with multi-sport support
export const MULTI_SPORT_PLAYERS = {
  cricket: [
    {
      id: 'cricket-1',
      name: 'Virat Kohli',
      team: 'RCB',
      sport: 'cricket',
      position: 'Batsman',
      currentBid: 15000000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      rating: 95,
      stats: { matches: 250, runs: 12000, average: 59.07 },
      bidders: ['user1', 'user2', 'user3']
    },
    {
      id: 'cricket-2', 
      name: 'MS Dhoni',
      team: 'CSK',
      sport: 'cricket',
      position: 'Wicket-keeper',
      currentBid: 12000000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      rating: 92,
      stats: { matches: 350, runs: 10000, average: 50.57 },
      bidders: ['user4', 'user5']
    }
  ],
  
  nfl: [
    {
      id: 'nfl-1',
      name: 'Patrick Mahomes',
      team: 'Kansas City Chiefs',
      sport: 'nfl',
      position: 'QB',
      currentBid: 25000000,
      image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400',
      rating: 98,
      stats: { games: 80, yards: 20000, touchdowns: 150 },
      bidders: ['user1', 'user3', 'user6']
    },
    {
      id: 'nfl-2',
      name: 'Aaron Donald',
      team: 'LA Rams', 
      sport: 'nfl',
      position: 'DEF',
      currentBid: 18000000,
      image: 'https://images.unsplash.com/photo-1562441656-57a2e7e38ea2?w=400',
      rating: 96,
      stats: { games: 120, sacks: 98, tackles: 400 },
      bidders: ['user2', 'user4']
    }
  ],
  
  nba: [
    {
      id: 'nba-1',
      name: 'LeBron James',
      team: 'LA Lakers',
      sport: 'nba', 
      position: 'SF',
      currentBid: 30000000,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498227?w=400',
      rating: 97,
      stats: { games: 1400, points: 38000, assists: 10000 },
      bidders: ['user1', 'user2', 'user5', 'user6']
    },
    {
      id: 'nba-2',
      name: 'Stephen Curry',
      team: 'Golden State Warriors',
      sport: 'nba',
      position: 'PG', 
      currentBid: 28000000,
      image: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400',
      rating: 95,
      stats: { games: 800, points: 20000, threePointers: 3000 },
      bidders: ['user3', 'user4', 'user5']
    }
  ]
};

// Sport-specific auction configurations
export const AUCTION_CONFIG = {
  cricket: {
    minBid: 1000000,
    bidIncrement: 1000000,
    maxBudget: 100000000,
    currency: '£',
    auctionDuration: 300 // 5 minutes
  },
  
  nfl: {
    minBid: 2000000,
    bidIncrement: 1000000,
    maxBudget: 200000000,
    currency: '$',
    auctionDuration: 600 // 10 minutes
  },
  
  nba: {
    minBid: 3000000,
    bidIncrement: 1000000,
    maxBudget: 150000000,
    currency: '$',
    auctionDuration: 450 // 7.5 minutes
  },
  
  rugby: {
    minBid: 500000,
    bidIncrement: 500000,
    maxBudget: 50000000,
    currency: '£',
    auctionDuration: 240 // 4 minutes
  },
  
  tennis: {
    minBid: 1500000,
    bidIncrement: 500000,
    maxBudget: 75000000,
    currency: '$',
    auctionDuration: 180 // 3 minutes
  },
  
  golf: {
    minBid: 1000000,
    bidIncrement: 500000,
    maxBudget: 60000000,
    currency: '$',
    auctionDuration: 300 // 5 minutes
  }
};

export default SPORTS_CONFIG;