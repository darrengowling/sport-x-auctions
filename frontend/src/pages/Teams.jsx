import React, { useState } from 'react';
import { Plus, Users, Trophy, TrendingUp, Star, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { mockTeams, mockPlayers, formatCurrency } from '../data/mock';

const Teams = () => {
  const [selectedTeam, setSelectedTeam] = useState(mockTeams[0]);

  // Mock team players - in real app this would come from backend
  const teamPlayers = [
    { ...mockPlayers[0], purchasePrice: 15000000, role: 'Captain' },
    { ...mockPlayers[1], purchasePrice: 12000000, role: 'Vice Captain' },
    { ...mockPlayers[2], purchasePrice: 11000000, role: 'Bowler' },
  ];

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Captain': return <Crown className="text-yellow-500" size={16} />;
      case 'Vice Captain': return <Star className="text-blue-500" size={16} />;
      case 'Bowler': return <Zap className="text-green-500" size={16} />;
      default: return <Users className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Teams</h1>
          <Button 
            size="sm"
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            <Plus size={16} className="mr-1" />
            Create Team
          </Button>
        </div>

        {/* Team Selector */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {mockTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`flex-shrink-0 p-3 rounded-lg transition-all ${
                  selectedTeam.id === team.id 
                    ? 'bg-white text-green-600 shadow-lg' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{team.avatar}</div>
                  <p className="font-medium text-sm">{team.name}</p>
                  <p className="text-xs opacity-75">{team.players}/{team.maxPlayers}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 -mt-2">
        {/* Team Overview */}
        <Card className="shadow-lg bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: selectedTeam.color, color: 'white' }}
              >
                {selectedTeam.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedTeam.name}</h2>
                <p className="text-sm text-gray-600">Owned by {selectedTeam.owner}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Trophy className="text-green-500" size={16} />
                  <span className="text-sm text-gray-600">Budget Left</span>
                </div>
                <p className="text-lg font-bold text-green-600">{formatCurrency(selectedTeam.remaining)}</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Users className="text-blue-500" size={16} />
                  <span className="text-sm text-gray-600">Squad Size</span>
                </div>
                <p className="text-lg font-bold text-blue-600">{selectedTeam.players}/{selectedTeam.maxPlayers}</p>
              </div>
            </div>
            
            {/* Budget Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Budget Utilized</span>
                <span>{Math.round((selectedTeam.spent / selectedTeam.budget) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(selectedTeam.spent / selectedTeam.budget) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatCurrency(selectedTeam.spent)} spent</span>
                <span>{formatCurrency(selectedTeam.budget)} total</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-md">
            <CardContent className="p-3 text-center">
              <TrendingUp className="text-green-500 mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Win Rate</p>
              <p className="font-bold text-green-600">67%</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-3 text-center">
              <Trophy className="text-blue-500 mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Rank</p>
              <p className="font-bold text-blue-600">#2</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-3 text-center">
              <Star className="text-orange-500 mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Points</p>
              <p className="font-bold text-orange-600">2,450</p>
            </CardContent>
          </Card>
        </div>

        {/* Squad */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Squad Players</span>
              <Badge variant="outline" className="border-blue-200 text-blue-600">
                {teamPlayers.length} Players
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {teamPlayers.length > 0 ? (
              <div className="space-y-3">
                {teamPlayers.map((player) => (
                  <div key={player.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img 
                      src={player.image} 
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{player.name}</h4>
                        {getRoleIcon(player.role)}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{player.team}</span>
                        <span>•</span>
                        <span>{player.role}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(player.purchasePrice)}</p>
                      <p className="text-xs text-gray-500">Purchase price</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto text-gray-400 mb-3" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Players Yet</h3>
                <p className="text-sm text-gray-600 mb-4">Start building your squad by joining auctions</p>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Join Auction
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle>Recent Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {[
                { match: 'vs Thunderbolts', result: 'Won', points: '+150', date: '2 days ago' },
                { match: 'vs Storm Kings', result: 'Lost', points: '-75', date: '5 days ago' },
                { match: 'vs Fire Dragons', result: 'Won', points: '+200', date: '1 week ago' },
              ].map((game, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{game.match}</p>
                    <p className="text-sm text-gray-600">{game.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={game.result === 'Won' ? 'bg-green-500' : 'bg-red-500'}>
                      {game.result}
                    </Badge>
                    <p className={`text-sm font-medium ${game.result === 'Won' ? 'text-green-600' : 'text-red-600'}`}>
                      {game.points} pts
                    </p>
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

export default Teams;