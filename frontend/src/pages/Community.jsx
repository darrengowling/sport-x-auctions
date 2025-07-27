import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, TrendingUp, Crown, Star, Medal, Flame, Clock, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { COMMUNITY_FEATURES } from '../data/sports';
import SPORT_X_THEME from '../constants/theme';
import ApiService from '../services/api';

const Community = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leaderboards');

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-orange-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-slate-400 font-bold">{rank}</span>;
    }
  };

  const getWinRateColor = (winRate) => {
    if (winRate >= 75) return 'text-green-500';
    if (winRate >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-slate-900">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Cricket <span className="text-white">Community</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto mb-8">
              Connect with fellow cricket enthusiasts, compete on leaderboards, and track the pulse of the auction arena
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg font-semibold">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>15,000+ Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6" />
                <span>Live Competitions</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6" />
                <span>Real-time Stats</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger 
              value="leaderboards"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900 text-white font-medium"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboards
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900 text-white font-medium"
            >
              <Flame className="w-4 h-4 mr-2" />
              Live Activity
            </TabsTrigger>
            <TabsTrigger 
              value="trending"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900 text-white font-medium"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
          </TabsList>

          {/* Leaderboards Tab */}
          <TabsContent value="leaderboards" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Bidders */}
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <span>Top Bidders</span>
                  </CardTitle>
                  <p className="text-slate-400">Masters of the auction arena</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {COMMUNITY_FEATURES.leaderboards.topBidders.map((bidder, index) => (
                      <div 
                        key={bidder.rank}
                        className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-slate-600 rounded-full">
                          {getRankIcon(bidder.rank)}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{bidder.user}</h4>
                          <p className="text-sm text-slate-400">
                            {bidder.totalBids} bids • {ApiService.formatCurrency(bidder.totalSpent)}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-bold ${getWinRateColor(bidder.winRate)}`}>
                            {bidder.winRate}%
                          </p>
                          <p className="text-xs text-slate-400">Win Rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Star className="w-6 h-6 text-blue-500" />
                    <span>Top Performers</span>
                  </CardTitle>
                  <p className="text-slate-400">Champions of team building</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {COMMUNITY_FEATURES.leaderboards.topPerformers.map((performer, index) => (
                      <div 
                        key={performer.rank}
                        className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-slate-600 rounded-full">
                          {getRankIcon(performer.rank)}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{performer.user}</h4>
                          <p className="text-sm text-slate-400">
                            {performer.teamsWon} teams won • Avg: {performer.avgScore}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-green-500">
                            {performer.points.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">Points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Activity Tab */}
          <TabsContent value="activity" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Bids */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Flame className="w-6 h-6 text-red-500" />
                    <span>Live Bidding Activity</span>
                  </CardTitle>
                  <p className="text-slate-400">Real-time auction action</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {COMMUNITY_FEATURES.socialActivity.recentBids.map((bid, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">🏏</span>
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            <span className="text-yellow-400">{bid.user}</span> bid on {bid.player}
                          </p>
                          <p className="text-sm text-slate-400 flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{bid.time}</span>
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-green-500">
                            {ApiService.formatCurrency(bid.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/auctions')}
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                  >
                    Join Live Auctions
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <span>Community Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-2xl font-bold text-white">£2.1B</p>
                      <p className="text-sm text-slate-400">Total Bids Today</p>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-2xl font-bold text-white">1,247</p>
                      <p className="text-sm text-slate-400">Active Bidders</p>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-2xl font-bold text-white">89</p>
                      <p className="text-sm text-slate-400">Live Auctions</p>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-2xl font-bold text-white">15,344</p>
                      <p className="text-sm text-slate-400">Community Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Trending Topics */}
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Hash className="w-6 h-6 text-blue-500" />
                    <span>Trending Topics</span>
                  </CardTitle>
                  <p className="text-slate-400">What's buzzing in cricket auctions</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {COMMUNITY_FEATURES.socialActivity.trending.map((topic, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <Hash className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="font-semibold text-white">{topic.topic}</p>
                            <p className="text-sm text-slate-400">{topic.mentions} mentions</p>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={topic.trend === 'rising' ? 'default' : 'secondary'}
                          className={`${topic.trend === 'rising' ? 'bg-green-500' : 'bg-slate-600'} text-white`}
                        >
                          {topic.trend === 'rising' ? '📈 Rising' : '📊 Stable'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Join Community CTA */}
              <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Join the Elite</CardTitle>
                  <p className="text-slate-300">Compete with the best cricket auction strategists</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <span className="text-white">Climb the leaderboards</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-6 h-6 text-blue-400" />
                      <span className="text-white">Connect with cricket fans</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-6 h-6 text-purple-400" />
                      <span className="text-white">Earn exclusive rewards</span>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={() => navigate('/leagues')}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-3"
                      >
                        Create Your League
                      </Button>
                      <Button 
                        onClick={() => navigate('/auctions')}
                        variant="outline"
                        className="w-full mt-3 border-2 border-slate-600 text-white hover:bg-slate-800"
                      >
                        Start Bidding
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;