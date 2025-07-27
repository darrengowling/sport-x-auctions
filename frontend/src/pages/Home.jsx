import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Flame, Clock, Users, TrendingUp, Gavel, Trophy, Star, ArrowRight, Crown, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { ENHANCED_CRICKET_PLAYERS, COMMUNITY_FEATURES } from '../data/sports';
import SPORT_X_THEME from '../constants/theme';
import ApiService from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());
  // Enhanced cricket data integration
  const [players, setPlayers] = useState(ENHANCED_CRICKET_PLAYERS);
  const [auctions, setAuctions] = useState([
    { 
      id: 'ipl-2024', 
      name: 'IPL 2024 Mega Auction', 
      participants: 156, 
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      sport: 'cricket',
      league: 'IPL',
      status: 'upcoming'
    },
    { 
      id: 'bbl-2024', 
      name: 'BBL 2024 Draft', 
      participants: 89, 
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      sport: 'cricket',
      league: 'BBL',
      status: 'upcoming'
    }
  ]);
  const [teams, setTeams] = useState([
    {
      id: 'team-1',
      name: 'Mumbai Warriors',
      performance: 89.2,
      wins: 12,
      losses: 3,
      points: 24,
      budget: 25000000,
      budgetUsed: 75000000
    },
    {
      id: 'team-2', 
      name: 'Delhi Gladiators',
      performance: 76.8,
      wins: 9,
      losses: 6,
      points: 18,
      budget: 35000000,
      budgetUsed: 65000000
    }
  ]);
  const [user] = useState({
    name: "Cricket Enthusiast",
    winRate: 72.4,
    totalWins: 18,
    totalMatches: 25,
    rank: 156,
    totalBids: 47,
    currentBudget: 45000000
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate loading for enhanced data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const hotPlayers = players.filter(player => player.isHotPick).slice(0, 3);
  const liveAuction = auctions.find(auction => auction.status === 'live');
  const upcomingAuctions = auctions.filter(auction => auction.status === 'upcoming').slice(0, 3);

  if (loading) {
    return (
      <LoadingSpinner 
        fullScreen={true} 
        size="xl" 
        message="Loading your cricket dashboard..." 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20 sm:pb-0">
      {/* Hero Section with Sport X Branding */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-slate-900 mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
              Welcome to <span className="text-white">Sport X</span>
            </h1>
            <p className="text-lg md:text-xl font-medium mb-6">
              Own cricket legends. Build championship teams. Dominate the auction arena.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm font-semibold">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Live Community</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Real Auctions</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Live Stats</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 -mt-2">
        {/* Live Auction Alert */}
        {liveAuction && (
          <Card className="border-2 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 shadow-lg transform hover:scale-105 transition-transform duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div>
                    <h3 className="font-bold text-gray-900">🔴 LIVE AUCTION</h3>
                    <p className="text-sm text-gray-600">{liveAuction.name}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate(`/auction/${liveAuction.id}`)}
                  className="bg-red-500 hover:bg-red-600 text-white animate-pulse"
                >
                  Join Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/teams')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Your Teams</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
                <Users className="text-blue-200" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/profile')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Win Rate</p>
                  <p className="text-2xl font-bold">{user.winRate}%</p>
                </div>
                <TrendingUp className="text-green-200" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hot Players */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="text-orange-500" size={20} />
                <span>Hot Players</span>
              </div>
              <Button
                onClick={() => navigate('/auctions')}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {hotPlayers.length > 0 ? (
              <div className="space-y-3">
                {hotPlayers.map((player) => (
                  <div 
                    key={player.id} 
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                    onClick={() => navigate('/auctions')}
                  >
                    <img 
                      src={player.image} 
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{player.name}</h4>
                      <p className="text-sm text-gray-500">{player.team} • {player.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{ApiService.formatCurrency(player.currentBid)}</p>
                      <p className="text-xs text-gray-500">{player.bidders?.length || 0} bidders</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Flame}
                title="No Hot Players Right Now"
                description="Check back later to see trending players, or browse all available players to find your favorites."
                actionText="Browse All Players"
                onAction={() => navigate('/auctions')}
                className="py-8"
              />
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => navigate('/auctions')}
            className="h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
          >
            <div className="text-center">
              <Gavel className="mx-auto mb-1" size={20} />
              <span className="text-sm font-medium">Join Auction</span>
            </div>
          </Button>
          
          <Button 
            onClick={() => navigate('/leagues')}
            variant="outline"
            className="h-16 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transform transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
          >
            <div className="text-center">
              <Trophy className="mx-auto mb-1 text-blue-500" size={20} />
              <span className="text-sm font-medium text-blue-600">Create League</span>
            </div>
          </Button>
        </div>

        {/* Upcoming Auctions */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="text-blue-500" size={20} />
                <span>Upcoming Auctions</span>
              </div>
              <Button
                onClick={() => navigate('/auctions')}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {upcomingAuctions.length > 0 ? (
                upcomingAuctions.map((auction) => (
                  <div 
                    key={auction.id} 
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors group"
                    onClick={() => navigate(`/auction/${auction.id}`)}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">{auction.name}</h4>
                      <p className="text-sm text-gray-500">{auction.participants || 0} teams registered</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {new Date(auction.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(auction.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No Upcoming Auctions"
                  description="All auctions are currently live or completed. Check back later for new auction opportunities."
                  actionText="Browse All Auctions"
                  onAction={() => navigate('/auctions')}
                  className="py-8"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Featured Leagues */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-500" size={20} />
                <span>Featured Leagues</span>
              </div>
              <Button
                onClick={() => navigate('/leagues')}
                variant="outline"
                size="sm"
                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors border border-yellow-200"
                onClick={() => navigate('/leagues')}
              >
                <div>
                  <h4 className="font-semibold text-gray-900">🏆 Global Masters</h4>
                  <p className="text-sm text-gray-500">500/1000 participants • £1,000,000 prize</p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/leagues');
                  }}
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Join Now
                </Button>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors border border-green-200"
                onClick={() => navigate('/leagues')}
              >
                <div>
                  <h4 className="font-semibold text-gray-900">🎮 Friends Championship</h4>
                  <p className="text-sm text-gray-500">8 participants • £50,000 prize</p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/leagues');
                  }}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;