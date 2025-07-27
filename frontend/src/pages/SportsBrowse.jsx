import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Clock, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { SPORTS_CONFIG } from '../data/sports';
import SPORT_X_THEME from '../constants/theme';

const SportsBrowse = () => {
  const navigate = useNavigate();

  const getSportStats = (sportId) => {
    const sport = SPORTS_CONFIG[sportId];
    return {
      totalPlayers: sport.playerCount,
      activeAuctions: Math.floor(Math.random() * 10) + 5,
      avgBidValue: `${sport.id === 'cricket' || sport.id === 'rugby' ? '£' : '$'}${(Math.random() * 20 + 10).toFixed(1)}M`,
      topBidder: `User${Math.floor(Math.random() * 100)}`
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-slate-900">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Choose Your <span className="text-white">Arena</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto mb-8">
              From cricket legends to NFL superstars - own the athletes that define greatness
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg font-semibold">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>6 Sports</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6" />
                <span>1000+ Athletes</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6" />
                <span>Live Auctions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sports Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Select Your Sport
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Each sport offers unique strategies, player dynamics, and auction experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(SPORTS_CONFIG).map((sport) => {
            const stats = getSportStats(sport.id);
            const isActive = sport.season === 'Active';
            
            return (
              <Card 
                key={sport.id}
                className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700 hover:border-slate-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/sports/${sport.id}`)}
              >
                {/* Sport Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="text-4xl p-3 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, ${sport.color}20, ${sport.color}40)`,
                          border: `2px solid ${sport.color}60`
                        }}
                      >
                        {sport.icon}
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                          {sport.displayName}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={isActive ? "default" : "secondary"}
                            className={`${isActive ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-300'} text-xs`}
                          >
                            {sport.season}
                          </Badge>
                          <span className="text-sm text-slate-400">{stats.totalPlayers} players</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-yellow-400 transform group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {sport.description}
                  </p>
                </CardHeader>

                {/* Sport Stats */}
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-slate-400">Live Auctions</span>
                      </div>
                      <p className="text-lg font-bold text-white">{stats.activeAuctions}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-slate-400">Avg Bid</span>
                      </div>
                      <p className="text-lg font-bold text-white">{stats.avgBidValue}</p>
                    </div>
                  </div>

                  {/* Positions */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-2">Player Positions:</p>
                    <div className="flex flex-wrap gap-1">
                      {sport.positions.slice(0, 3).map((position, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="text-xs bg-slate-700/50 border-slate-600 text-slate-300"
                        >
                          {position}
                        </Badge>
                      ))}
                      {sport.positions.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-slate-700/50 border-slate-600 text-slate-300">
                          +{sport.positions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${sport.gradient} hover:opacity-90 text-white font-semibold py-3 rounded-lg transform transition-all hover:scale-105 active:scale-95`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/sports/${sport.id}`);
                    }}
                  >
                    Enter {sport.displayName} Arena
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              New to Sport X Auctions?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Learn how to build championship teams, master bidding strategies, and compete with sports fans worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/how-it-works')}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold px-8 py-3"
              >
                How It Works
              </Button>
              <Button 
                onClick={() => navigate('/leagues')}
                variant="outline"
                className="border-2 border-slate-600 text-white hover:bg-slate-800 px-8 py-3"
              >
                Browse Leagues
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsBrowse;