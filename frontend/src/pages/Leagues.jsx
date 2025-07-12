import React, { useState } from 'react';
import { Plus, Search, Trophy, Users, Clock, Copy, Share2, Lock, Globe, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { mockLeagues, formatCurrency } from '../data/mock';

const Leagues = () => {
  const [activeTab, setActiveTab] = useState('joined');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const copyLeagueCode = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied! 📋",
      description: `League code ${code} copied to clipboard`,
    });
  };

  const joinLeague = (league) => {
    toast({
      title: "League Joined! 🎉",
      description: `Welcome to ${league.name}`,
    });
  };

  const getLeagueIcon = (type) => {
    return type === 'private' ? <Lock size={16} /> : <Globe size={16} />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'joining': return 'bg-blue-500 text-white';
      case 'upcoming': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredLeagues = mockLeagues.filter(league => {
    const matchesSearch = league.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'joined') {
      return matchesSearch && (league.creator === 'You' || league.name.includes('Friends'));
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Leagues</h1>
          <Button 
            size="sm"
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            <Plus size={16} className="mr-1" />
            Create League
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search leagues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/20 rounded-lg p-1">
          {['joined', 'discover'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {tab === 'joined' ? 'My Leagues' : 'Discover'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 -mt-2">
        {/* Featured League */}
        {activeTab === 'discover' && (
          <Card className="shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Star className="text-white" size={24} />
                  </div>
                  <div>
                    <Badge className="bg-yellow-500 text-white mb-2">
                      ⭐ FEATURED
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900">Global Masters</h3>
                    <p className="text-gray-600">The ultimate cricket championship</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Prize Pool</p>
                  <p className="text-lg font-bold text-green-600">₹10,00,000</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Participants</p>
                  <p className="text-lg font-bold text-blue-600">500/1000</p>
                </div>
              </div>

              <Button 
                onClick={() => joinLeague(mockLeagues[2])}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
              >
                Join for ₹5,000
              </Button>
            </CardContent>
          </Card>
        )}

        {/* League List */}
        <div className="space-y-4">
          {filteredLeagues.map((league) => (
            <Card 
              key={league.id} 
              className="shadow-lg hover:shadow-xl transition-shadow bg-white"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{league.name}</h3>
                      <div className="flex items-center space-x-1">
                        {getLeagueIcon(league.type)}
                        <span className="text-xs text-gray-500 capitalize">{league.type}</span>
                      </div>
                    </div>
                    
                    {league.description && (
                      <p className="text-sm text-gray-600 mb-2">{league.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{league.participants} {league.maxParticipants ? `/ ${league.maxParticipants}` : ''} teams</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy size={14} />
                        <span>{league.prize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(league.status)}>
                    {league.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Prize Pool</p>
                    <p className="font-bold text-green-600">{league.prize}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Entry Fee</p>
                    <p className="font-bold text-blue-600">{league.entryFee}</p>
                  </div>
                </div>

                {/* League Code for Private Leagues */}
                {league.type === 'private' && league.code && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">League Code</p>
                        <p className="font-mono font-bold text-gray-900">{league.code}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => copyLeagueCode(league.code)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {league.creator === 'You' ? (
                    <Button 
                      variant="outline" 
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Manage League
                    </Button>
                  ) : league.status === 'joining' ? (
                    <Button 
                      onClick={() => joinLeague(league)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Join League
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="flex-1 border-gray-200 text-gray-600"
                    >
                      View Details
                    </Button>
                  )}
                  
                  {league.status === 'active' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      <Trophy size={16} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLeagues.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Trophy size={48} className="mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900">No leagues found</h3>
                <p className="text-sm">
                  {activeTab === 'joined' 
                    ? "You haven't joined any leagues yet" 
                    : "Try adjusting your search criteria"
                  }
                </p>
              </div>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                <Plus size={16} className="mr-1" />
                Create Your First League
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Leagues;