import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, Users, ArrowRight, Flame, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import ApiService from '../services/api';

const Auctions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [auctions, setAuctions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [auctionsData, playersData] = await Promise.all([
          ApiService.getAuctions(),
          ApiService.getPlayers()
        ]);
        
        setAuctions(auctionsData);
        setPlayers(playersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white';
      case 'upcoming': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live': return '🔴';
      case 'upcoming': return '⏰';
      case 'completed': return '✅';
      default: return '📅';
    }
  };

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || auction.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const featuredPlayers = players.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 pb-6">
        <h1 className="text-2xl font-bold mb-4">Auctions</h1>
        
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70"
            />
          </div>
          
          <div className="flex space-x-2">
            {['all', 'live', 'upcoming', 'completed'].map(filter => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className={selectedFilter === filter ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 -mt-2">
        {/* Featured Players */}
        <Card className="shadow-lg bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Star className="text-orange-500" size={20} />
              <span>Featured Players</span>
              <Badge className="bg-orange-500 text-white ml-auto">
                Hot
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              {featuredPlayers.map((player) => (
                <div 
                  key={player.id}
                  className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate('/auction/auction-1')}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={player.image_url} 
                      alt={player.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{player.name}</h4>
                      <p className="text-xs text-gray-500">{player.team}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-green-600">{ApiService.formatCurrency(player.current_bid)}</span>
                    {player.is_hot_pick && <Flame className="text-orange-500" size={12} />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Auction List */}
        <div className="space-y-4">
          {filteredAuctions.map((auction) => (
            <Card 
              key={auction.id} 
              className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white"
              onClick={() => navigate(`/auction/${auction.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{auction.name}</h3>
                      <Badge className={getStatusColor(auction.status)}>
                        {getStatusIcon(auction.status)} {auction.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{auction.participants?.length || 0} teams</span>
                      </div>
                      {auction.status === 'live' && auction.time_remaining && (
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{auction.time_remaining}s left</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="text-gray-400 mt-2" size={20} />
                </div>

                {auction.status === 'live' && auction.current_player_id && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Live auction in progress
                        </p>
                        <p className="text-xs text-gray-600">
                          Budget: {ApiService.formatCurrency(auction.total_budget)}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {auction.status === 'upcoming' && auction.start_time && (
                      <span>Starts: {new Date(auction.start_time).toLocaleDateString()}</span>
                    )}
                    {auction.status === 'completed' && (
                      <span>Completed</span>
                    )}
                    {auction.status === 'live' && (
                      <span className="text-red-600 font-medium">🔴 Live Now</span>
                    )}
                  </div>
                  
                  <Button 
                    size="sm"
                    className={
                      auction.status === 'live' 
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                        : auction.status === 'upcoming'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }
                  >
                    {auction.status === 'live' && 'Join Live'}
                    {auction.status === 'upcoming' && 'Register'}
                    {auction.status === 'completed' && 'View Results'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900">No auctions found</h3>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Auctions;