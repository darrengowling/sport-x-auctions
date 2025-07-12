import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Flame, Clock, Users, TrendingUp, Gavel, Trophy } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold text-white mb-2">Sports X</h1>
          <p className="text-blue-200">Loading your pro cricket auction experience...</p>
        </div>
      </div>
    );
  }

  const liveAuction = auctions.find(auction => auction.status === 'live');
  const hotPlayers = players.filter(player => player.is_hot_pick);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">SX</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sport X</h1>
              <p className="text-blue-100 text-sm">Sports gaming with friends</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setNotifications(0)}
              className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-1">Welcome back, {user.name}! 🏏</h2>
          <p className="text-blue-100 text-sm">Ready to outbid the ordinary? No bets. No chance.</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 -mt-2 pb-6">
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
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
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
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
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
            <CardTitle className="flex items-center space-x-2">
              <Flame className="text-orange-500" size={20} />
              <span>Hot Players</span>
              <Badge variant="destructive" className="ml-auto">
                Trending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {hotPlayers.slice(0, 3).map((player) => (
                <div 
                  key={player.id} 
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/auctions')}
                >
                  <img 
                    src={player.image_url} 
                    alt={player.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{player.name}</h4>
                    <p className="text-sm text-gray-500">{player.team} • {player.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{ApiService.formatCurrency(player.current_bid)}</p>
                    <p className="text-xs text-gray-500">{player.bidders?.length || 0} bidders</p>
                  </div>
                </div>
              ))}
            </div>
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
            <CardTitle className="flex items-center space-x-2">
              <Clock className="text-blue-500" size={20} />
              <span>Upcoming Auctions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {auctions.filter(auction => auction.status === 'upcoming').map((auction) => (
                <div key={auction.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{auction.name}</h4>
                    <p className="text-sm text-gray-500">{auction.participants?.length || 0} teams registered</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">
                      {new Date(auction.start_time).toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="border-blue-200 text-blue-600">
                      Upcoming
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;