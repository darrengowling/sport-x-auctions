import React, { useState } from 'react';
import { Settings, Trophy, TrendingUp, Calendar, Award, Share2, Edit2, LogOut, Bell, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { mockUser } from '../data/mock';

const Profile = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoJoin, setAutoJoin] = useState(false);

  const achievements = [
    { icon: '🏆', title: 'First Win', description: 'Won your first league', date: '2024-03-20' },
    { icon: '🔥', title: 'Hot Bidder', description: 'Won 5 auctions in a row', date: '2024-06-15' },
    { icon: '💎', title: 'Big Spender', description: 'Spent over ₹50 Cr in auctions', date: '2024-08-10' },
    { icon: '⚡', title: 'Quick Draw', description: 'Fastest bid in 10 seconds', date: '2024-12-05' },
  ];

  const stats = [
    { label: 'Total Matches', value: mockUser.totalMatches, icon: Calendar, color: 'text-blue-500' },
    { label: 'Total Wins', value: mockUser.totalWins, icon: Trophy, color: 'text-green-500' },
    { label: 'Win Rate', value: `${mockUser.winRate}%`, icon: TrendingUp, color: 'text-orange-500' },
    { label: 'Level', value: mockUser.level, icon: Award, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/20"
            >
              <Share2 size={16} />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/20"
            >
              <Settings size={16} />
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src={mockUser.avatar} 
              alt={mockUser.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{mockUser.name}</h2>
              <p className="text-indigo-100 mb-2">{mockUser.username}</p>
              <Badge className="bg-yellow-500 text-white">
                <Award size={12} className="mr-1" />
                {mockUser.level}
              </Badge>
            </div>
            <Button 
              size="sm" 
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              <Edit2 size={14} className="mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-indigo-100 text-sm">Favorite Team: {mockUser.favoriteTeam}</p>
            <p className="text-indigo-100 text-sm">Joined: {new Date(mockUser.joinedDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 -mt-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-4 text-center">
                  <Icon className={`mx-auto mb-2 ${stat.color}`} size={24} />
                  <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Achievements */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="text-yellow-500" size={20} />
              <span>Achievements</span>
              <Badge variant="outline" className="border-yellow-200 text-yellow-600 ml-auto">
                {achievements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Settings className="text-gray-500" size={20} />
              <span>Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="text-blue-500" size={18} />
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Get notified about auctions and bids</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trophy className="text-green-500" size={18} />
                  <div>
                    <p className="font-medium text-gray-900">Auto-Join Leagues</p>
                    <p className="text-sm text-gray-600">Automatically join suitable leagues</p>
                  </div>
                </div>
                <Switch 
                  checked={autoJoin} 
                  onCheckedChange={setAutoJoin}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Shield size={16} className="mr-2" />
            Privacy & Security
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <Settings size={16} className="mr-2" />
            Account Settings
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>

        {/* App Info */}
        <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">SX</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Sports X</h3>
            <p className="text-sm text-gray-600 mb-3">Pro Cricket Auctions</p>
            <p className="text-xs text-gray-500">Version 1.0.0 • Made with ❤️ by Sports X Team</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;