import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Gavel, Heart, Share2, Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import ApiService from '../services/api';

const AuctionRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(45);
  const [bidAmount, setBidAmount] = useState('');
  const [userBid, setUserBid] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [auction, setAuction] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [auctionData, playersData, teamsData] = await Promise.all([
          ApiService.getAuction(id),
          ApiService.getPlayers(),
          ApiService.getTeams()
        ]);
        
        setAuction(auctionData);
        setPlayers(playersData);
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching auction data:', error);
        setError('Auction not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Move to next player when time runs out
      if (currentPlayerIndex < players.length - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setTimeLeft(60);
        setUserBid(0);
        setBidAmount('');
      }
    }
  }, [timeLeft, currentPlayerIndex, players.length]);

  const handleBid = async () => {
    const bid = parseInt(bidAmount);
    const currentPlayer = players[currentPlayerIndex];
    
    if (!currentPlayer) {
      toast({
        title: "Error",
        description: "No player selected for bidding",
        variant: "destructive"
      });
      return;
    }

    if (!bid || bid <= currentPlayer.current_bid) {
      toast({
        title: "Invalid Bid",
        description: "Bid must be higher than current bid",
        variant: "destructive"
      });
      return;
    }

    const userTeam = teams.find(team => team.owner_name === "Cricket Fan");
    if (userTeam && bid > userTeam.remaining) {
      toast({
        title: "Insufficient Budget",
        description: "You don't have enough budget for this bid",
        variant: "destructive"
      });
      return;
    }

    try {
      await ApiService.placeBid(currentPlayer.id, bid, "Your Team");
      setUserBid(bid);
      toast({
        title: "Bid Placed! 🎯",
        description: `You bid ${ApiService.formatCurrency(bid)} for ${currentPlayer.name}`,
      });
      setBidAmount('');
      
      // Update local player data
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].current_bid = bid;
      setPlayers(updatedPlayers);
    } catch (error) {
      toast({
        title: "Bid Failed",
        description: error.response?.data?.detail || "Failed to place bid",
        variant: "destructive"
      });
    }
  };

  const quickBidAmounts = [100000, 500000, 1000000, 2000000];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading auction...</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/auctions')}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold">Auction Not Found</h1>
          </div>
        </div>
        
        <div className="p-4 flex-1 flex items-center justify-center">
          <Card className="shadow-lg max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Gavel size={48} className="mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Auction Not Available</h3>
                <p className="text-sm text-gray-600 mb-4">
                  The auction you're looking for doesn't exist or has ended.
                </p>
                <Button 
                  onClick={() => navigate('/auctions')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  View Available Auctions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];
  const userTeam = teams.find(team => team.owner_name === "Cricket Fan") || teams[0];

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/auctions')}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold">Auction Complete</h1>
          </div>
        </div>
        
        <div className="p-4 flex-1 flex items-center justify-center">
          <Card className="shadow-lg max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Trophy size={48} className="mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Auction Complete!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  All players have been auctioned. Check your team!
                </p>
                <Button 
                  onClick={() => navigate('/teams')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  View My Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <button 
            onClick={() => navigate('/auctions')}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{auction.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-red-100">
              <div className="flex items-center space-x-1">
                <Users size={14} />
                <span>{auction.participants?.length || 0} teams</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>LIVE</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <Heart size={18} />
            </button>
            <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Time Remaining</h3>
              <p className="text-red-100 text-sm">Current bidding round</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{timeLeft}s</div>
              <div className="w-16 h-2 bg-white/30 rounded-full mt-1">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 -mt-2">
        {/* Current Player */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Badge className="bg-red-500 text-white mb-3">
                🔴 NOW BIDDING
              </Badge>
              <img 
                src={currentPlayer.image_url} 
                alt={currentPlayer.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-200 shadow-lg"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentPlayer.name}</h2>
              <p className="text-gray-600">{currentPlayer.team} • {currentPlayer.role}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Base Price</p>
                <p className="text-lg font-bold text-green-600">{ApiService.formatCurrency(currentPlayer.base_price)}</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Current Bid</p>
                <p className="text-lg font-bold text-blue-600">{ApiService.formatCurrency(currentPlayer.current_bid)}</p>
              </div>
            </div>

            {/* Player Stats */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Performance Stats</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Matches:</span>
                  <span className="font-medium">{currentPlayer.stats?.matches || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Strike Rate:</span>
                  <span className="font-medium">{currentPlayer.stats?.strike_rate || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Runs:</span>
                  <span className="font-medium">{currentPlayer.stats?.runs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average:</span>
                  <span className="font-medium">{currentPlayer.stats?.average || 0}</span>
                </div>
              </div>
            </div>

            {/* Active Bidders */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Active Bidders</h4>
              <div className="flex flex-wrap gap-2">
                {currentPlayer.bidders?.map((bidder, index) => (
                  <Badge key={index} variant="outline" className="border-blue-200 text-blue-600">
                    {bidder}
                  </Badge>
                ))}
                {userBid > 0 && (
                  <Badge className="bg-green-500 text-white">
                    You (Leading)
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bidding Interface */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Place Your Bid</h3>
            
            {/* Custom Bid */}
            <div className="flex space-x-2 mb-4">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  type="number"
                  placeholder="Enter bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button 
                onClick={handleBid}
                disabled={!bidAmount || parseInt(bidAmount) <= currentPlayer.current_bid}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                <Gavel size={16} className="mr-1" />
                Bid
              </Button>
            </div>

            {/* Quick Bid Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickBidAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBidAmount((currentPlayer.current_bid + amount).toString())}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  +{ApiService.formatCurrency(amount)}
                </Button>
              ))}
            </div>

            {/* Team Budget */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Remaining Budget:</span>
                <span className="font-bold text-yellow-600">{ApiService.formatCurrency(userTeam.remaining)}</span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(userTeam.remaining / userTeam.budget) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Participating Teams</h3>
            <div className="space-y-2">
              {teams.slice(0, 3).map((team) => (
                <div key={team.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: team.color, color: 'white' }}
                    >
                      {team.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{team.name}</p>
                      <p className="text-xs text-gray-500">{team.owner_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{ApiService.formatCurrency(team.remaining)}</p>
                    <p className="text-xs text-gray-500">{team.players?.length || 0}/{team.max_players} players</p>
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

export default AuctionRoom;