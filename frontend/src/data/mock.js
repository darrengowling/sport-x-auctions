// Mock data for Sports X Fantasy Cricket Auction App

export const mockPlayers = [
  {
    id: 1,
    name: "David Warner",
    team: "SRH",
    role: "Batsman",
    basePrice: 2000000,
    currentBid: 15000000,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzNzNkYyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RGF2aWQgV2FybmVyPC90ZXh0Pgo8L3N2Zz4=",
    stats: {
      matches: 230,
      runs: 7263,
      average: 37.25,
      strikeRate: 131.97,
      centuries: 7,
      fifties: 50
    },
    isHotPick: true,
    bidders: ["Team Alpha", "Thunderbolts", "Warriors"]
  },
  {
    id: 2,
    name: "MS Dhoni",
    team: "CSK",
    role: "Wicket-Keeper",
    basePrice: 1500000,
    currentBid: 12000000,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    stats: {
      matches: 264,
      runs: 5082,
      average: 39.13,
      strikeRate: 135.92,
      centuries: 0,
      fifties: 24
    },
    isHotPick: true,
    bidders: ["Storm Kings", "Fire Dragons"]
  },
  {
    id: 3,
    name: "Jasprit Bumrah",
    team: "MI",
    role: "Bowler",
    basePrice: 1800000,
    currentBid: 11000000,
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
    stats: {
      matches: 120,
      wickets: 165,
      economy: 7.39,
      average: 24.43,
      strikeRate: 19.8,
      bestFigures: "4/17"
    },
    isHotPick: false,
    bidders: ["Lightning Bolts"]
  },
  {
    id: 4,
    name: "Rohit Sharma",
    team: "MI",
    role: "Batsman",
    basePrice: 2200000,
    currentBid: 13500000,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    stats: {
      matches: 243,
      runs: 6628,
      average: 31.17,
      strikeRate: 130.61,
      centuries: 8,
      fifties: 42
    },
    isHotPick: true,
    bidders: ["Team Alpha", "Storm Kings", "Warriors"]
  }
];

export const mockTeams = [
  {
    id: 1,
    name: "Team Alpha",
    owner: "You",
    budget: 25000000,
    spent: 42000000,
    remaining: 8000000,
    players: 8,
    maxPlayers: 15,
    avatar: "🏆",
    color: "#3B82F6"
  },
  {
    id: 2,
    name: "Thunderbolts",
    owner: "Alex Kumar",
    budget: 50000000,
    spent: 38000000,
    remaining: 12000000,
    players: 7,
    maxPlayers: 15,
    avatar: "⚡",
    color: "#F59E0B"
  },
  {
    id: 3,
    name: "Storm Kings",
    owner: "Priya Singh",
    budget: 50000000,
    spent: 35000000,
    remaining: 15000000,
    players: 6,
    maxPlayers: 15,
    avatar: "👑",
    color: "#8B5CF6"
  }
];

export const mockAuctions = [
  {
    id: 1,
    name: "IPL 2025 Mega Auction",
    status: "live",
    participants: 8,
    currentPlayer: mockPlayers[0],
    timeRemaining: 45,
    totalBudget: 50000000,
    startTime: "2025-01-15T10:00:00Z",
    rules: {
      maxPlayers: 15,
      minPlayers: 11,
      maxOverseas: 4,
      retentionAllowed: true
    }
  },
  {
    id: 2,
    name: "Champions League Auction",
    status: "upcoming",
    participants: 12,
    startTime: "2025-02-01T14:00:00Z",
    totalBudget: 75000000
  },
  {
    id: 3,
    name: "Weekend Warriors Cup",
    status: "completed",
    participants: 6,
    winner: "Storm Kings",
    endTime: "2025-01-10T18:00:00Z"
  }
];

export const mockLeagues = [
  {
    id: 1,
    name: "Friends Championship",
    type: "private",
    participants: 8,
    status: "active",
    prize: "₹50,000",
    entryFee: "₹1,000",
    creator: "You",
    code: "FRC2025",
    description: "Epic battle among friends for cricket supremacy!"
  },
  {
    id: 2,
    name: "Office League",
    type: "private",
    participants: 12,
    status: "active",
    prize: "₹1,00,000",
    entryFee: "₹2,000",
    creator: "Rahul Mehta",
    code: "OFF2025"
  },
  {
    id: 3,
    name: "Global Masters",
    type: "public",
    participants: 500,
    status: "joining",
    prize: "₹10,00,000",
    entryFee: "₹5,000",
    creator: "Sports X",
    maxParticipants: 1000
  }
];

export const mockNotifications = [
  {
    id: 1,
    type: "bid",
    title: "New Bid on Virat Kohli",
    message: "Thunderbolts bid ₹15.5 Cr",
    time: "2 min ago",
    read: false
  },
  {
    id: 2,
    type: "auction",
    title: "Auction Starting Soon",
    message: "IPL 2025 Mega Auction starts in 15 minutes",
    time: "13 min ago",
    read: false
  },
  {
    id: 3,
    type: "team",
    title: "Player Added",
    message: "MS Dhoni added to your team",
    time: "1 hour ago",
    read: true
  }
];

export const mockUser = {
  id: 1,
  name: "Cricket Fan",
  username: "@cricketfan",
  email: "fan@sportsX.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  level: "Pro Bidder",
  totalWins: 12,
  totalMatches: 28,
  winRate: 42.8,
  favoriteTeam: "RCB",
  joinedDate: "2024-03-15"
};

export const formatCurrency = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return `₹${amount}`;
};

export const getTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now - time;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};