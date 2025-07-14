import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Trophy, Users, Clock, Star, 
  Lock, Globe, ArrowRight, Crown, Target 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import CreateLeagueModal from '../components/CreateLeagueModal';
import { mockLeagues, formatCurrency } from '../data/mock';

const Leagues = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [leagues, setLeagues] = useState(mockLeagues);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'joining': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🏏';
      case 'joining': return '👥';
      case 'completed': return '🏆';
      default: return '📅';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'private' ? <Lock size={14} /> : <Globe size={14} />;
  };

  const filteredLeagues = leagues.filter(league => {
    const matchesSearch = league.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'my-leagues' && league.creator === 'You') ||
                         (selectedFilter === 'public' && league.type === 'public') ||
                         (selectedFilter === 'private' && league.type === 'private');
    return matchesSearch && matchesFilter;
  });

  const handleCreateLeague = (newLeague) => {
    setLeagues([newLeague, ...leagues]);
  };

  const handleJoinLeague = (leagueId) => {
    setLeagues(leagues.map(league => 
      league.id === leagueId 
        ? { ...league, participants: league.participants + 1 }
        : league
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Leagues</h1>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-purple-600 hover:bg-gray-100"
            size="sm"
          >
            <Plus size={16} className="mr-2" />
            Create League
          </Button>
        </div>
        
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search leagues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: 'All Leagues' },
              { key: 'my-leagues', label: 'My Leagues' },
              { key: 'public', label: 'Public' },
              { key: 'private', label: 'Private' }
            ].map(filter => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFilter(filter.key)}
                className={`flex-shrink-0 ${
                  selectedFilter === filter.key 
                    ? 'bg-white text-purple-600' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 -mt-2 pb-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <Trophy className="text-yellow-500 mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Leagues Won</p>
              <p className="font-bold text-yellow-600">3</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <Crown className="text-purple-500 mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Active Leagues</p>
              <p className="font-bold text-purple-600">2</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <Target className="text-blue-500 mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Win Rate</p>
              <p className="font-bold text-blue-600">75%</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured League */}
        <Card className="shadow-lg border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-yellow-500 text-white">
                🏆 Featured
              </Badge>
              <Badge variant="outline" className="border-yellow-400 text-yellow-700">
                ₹10,00,000 Prize
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Global Masters Championship</h3>
            <p className="text-sm text-gray-700 mb-3">
              The ultimate cricket fantasy league with massive prizes and international competition.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-700">
                <span className="flex items-center">
                  <Users size={14} className="mr-1" />
                  500/1000
                </span>
                <span className="flex items-center">
                  <Globe size={14} className="mr-1" />
                  Public
                </span>
              </div>
              <Button 
                onClick={() => handleJoinLeague(3)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                size="sm"
              >
                Join League
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leagues List */}
        <div className="space-y-4">
          {filteredLeagues.length > 0 ? (
            filteredLeagues.map((league) => (
              <Card 
                key={league.id} 
                className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/league/${league.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-900">{league.name}</h3>
                        {getTypeIcon(league.type)}
                        <Badge 
                          className={`${getStatusColor(league.status)} text-xs`}
                        >
                          {getStatusIcon(league.status)} {league.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{league.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>Created by {league.creator}</span>
                        {league.code && (
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            Code: {league.code}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium text-green-600">{league.prize}</p>
                      <p className="text-xs text-gray-600">{league.entryFee} entry</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-700">
                      <span className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {league.participants}/{league.maxParticipants || '∞'}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {league.status === 'joining' ? 'Open for registration' : 'In progress'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {league.creator !== 'You' && league.status === 'joining' && (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinLeague(league.id);
                          }}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Join
                        </Button>
                      )}
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Progress Bar for Participants */}
                  {league.maxParticipants && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(league.participants / league.maxParticipants) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Leagues Found</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {searchTerm 
                    ? `No leagues match "${searchTerm}"`
                    : 'Create your first league or browse available ones'
                  }
                </p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Create League
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* My Active Leagues */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Star className="text-yellow-500" size={20} />
              <span>My Active Leagues</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {leagues.filter(league => league.creator === 'You' && league.status === 'active').map((league) => (
                <div 
                  key={league.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => navigate(`/league/${league.id}`)}
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">{league.name}</h4>
                    <p className="text-sm text-gray-700">
                      {league.participants} participants • {league.prize}
                    </p>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    Active
                  </Badge>
                </div>
              ))}
              
              {leagues.filter(league => league.creator === 'You' && league.status === 'active').length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-600 text-sm">No active leagues</p>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Create Your First League
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create League Modal */}
      <CreateLeagueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateLeague={handleCreateLeague}
      />
    </div>
  );
};

export default Leagues;