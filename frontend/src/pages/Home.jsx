import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Flame, Clock, Users, TrendingUp, Gavel, Trophy, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import ApiService from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [players, setPlayers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [user] = useState({
    name: "Cricket Fan",
    winRate: 42.8,
    totalWins: 12,
    totalMatches: 28
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [playersData, auctionsData, teamsData] = await Promise.all([
          ApiService.getPlayers(),
          ApiService.getAuctions(),
          ApiService.getTeams()
        ]);
        
        setPlayers(playersData);
        setAuctions(auctionsData);
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hotPlayers = players.filter(player => player.isHotPick).slice(0, 3);
  const liveAuction = auctions.find(auction => auction.status === 'live');
  const upcomingAuctions = auctions.filter(auction => auction.status === 'upcoming').slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20 sm:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome back! 🏏</h1>
            <p className="text-blue-100 opacity-90 text-lg mt-2">Ready to dominate the auctions?</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/profile')}
              className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            
            <div className="text-right">
              <p className="text-sm font-medium">{currentTime.toLocaleTimeString()}</p>
              <p className="text-xs text-blue-200">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
              <p className="text-blue-100 text-sm">Your cricket empire awaits. No bets. No chance.</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{user.winRate}%</p>
              <p className="text-blue-200 text-sm">Win Rate</p>
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
            <div className="space-y-3">
              {hotPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
              ))}
            </div>
            {hotPlayers.length === 0 && (
              <div className="text-center py-8">
                <Flame className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-500">No hot players right now</p>
                <Button 
                  onClick={() => navigate('/auctions')}
                  className="mt-2"
                  size="sm"
                >
                  Browse All Players
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => navigate('/auctions')}
            className="h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
          >
            <div className="text-center">
              <Gavel className="mx-auto mb-1" size={20} />
              <span className="text-sm font-medium">Join Auction</span>
            </div>
          </Button>
          
          <Button 
            onClick={() => navigate('/leagues')}
            variant="outline"
            className="h-16 border-2 border-blue-200 hover:bg-blue-50"
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
              {upcomingAuctions.map((auction) => (
                <div 
                  key={auction.id} 
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
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
              ))}
              
              {upcomingAuctions.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="mx-auto text-gray-400 mb-3" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Auctions</h3>
                  <p className="text-sm text-gray-600 mb-4">Check back later for new auction opportunities</p>
                  <Button 
                    onClick={() => navigate('/auctions')}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Browse Auctions
                  </Button>
                </div>
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