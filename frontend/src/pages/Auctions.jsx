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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
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
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['all', 'live', 'upcoming', 'completed'].map(filter => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className={`flex-shrink-0 ${
                  selectedFilter === filter 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 -mt-2 pb-6">
        {/* Featured Players */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="text-orange-500" size={20} />
                <span>Featured Players</span>
              </div>
              <Badge variant="destructive" className="bg-orange-500">
                Hot
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-3">
              {featuredPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/auction/${player.id}`)}
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
          </CardContent>
        </Card>

        {/* Auctions List */}
        <div className="space-y-4">
          {filteredAuctions.length > 0 ? (
            filteredAuctions.map((auction) => (
              <Card 
                key={auction.id} 
                className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/auction/${auction.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{auction.name}</h3>
                        <Badge 
                          className={`${getStatusColor(auction.status)} text-xs`}
                        >
                          {getStatusIcon(auction.status)} {auction.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <Users size={14} className="mr-1" />
                          {auction.participants || 0} teams
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {auction.status === 'live' ? 'Live now' : 
                           auction.status === 'upcoming' ? 'Starting soon' : 'Completed'}
                        </span>
                      </div>

                      {auction.currentPlayer && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                          <p className="text-xs text-blue-600 font-medium mb-1">CURRENT BID</p>
                          <div className="flex items-center space-x-2">
                            <img 
                              src={auction.currentPlayer.image} 
                              alt={auction.currentPlayer.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{auction.currentPlayer.name}</p>
                              <p className="text-sm text-green-600 font-bold">
                                {ApiService.formatCurrency(auction.currentPlayer.currentBid)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {auction.startTime && (
                        <span>
                          {auction.status === 'upcoming' 
                            ? `Starts: ${new Date(auction.startTime).toLocaleDateString()}`
                            : `Started: ${new Date(auction.startTime).toLocaleDateString()}`
                          }
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {auction.status === 'live' && (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/auction/${auction.id}`);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white animate-pulse"
                          size="sm"
                        >
                          Join Live
                        </Button>
                      )}
                      {auction.status === 'upcoming' && (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/auction/${auction.id}`);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          size="sm"
                        >
                          Register
                        </Button>
                      )}
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Auctions Found</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {searchTerm 
                    ? `No auctions match "${searchTerm}"`
                    : selectedFilter === 'all' 
                      ? 'No auctions available right now' 
                      : `No ${selectedFilter} auctions available`
                  }
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFilter('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Action */}
        <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardContent className="p-6 text-center">
            <Flame className="mx-auto text-orange-500 mb-3" size={32} />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Start Bidding?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Join live auctions or register for upcoming ones to build your dream team
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/teams')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                View My Teams
              </Button>
              <Button 
                onClick={() => navigate('/leagues')}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Create League
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auctions;