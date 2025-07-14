import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, Users, MessageCircle, Send, Gavel, TrendingUp, 
  Crown, Timer, AlertCircle, Zap, Eye, User 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuction } from '../contexts/AuctionContext';
import { formatCurrency } from '../data/mock';

const AuctionRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentAuction,
    currentPlayer,
    bidHistory,
    participants,
    timeRemaining,
    totalTimeLeft,
    isConnected,
    chatMessages,
    newBidAlert,
    connectToAuction,
    disconnectFromAuction,
    placeBid,
    sendChatMessage,
    getMaxBid,
    getNextBidAmount,
    canBid
  } = useAuction();

  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [customBidAmount, setCustomBidAmount] = useState('');
  const chatEndRef = useRef(null);
  const alertAudioRef = useRef(null);

  useEffect(() => {
    // Connect to auction when component mounts
    connectToAuction(id);
    
    return () => {
      // Disconnect when component unmounts
      disconnectFromAuction();
    };
  }, [id]);

  useEffect(() => {
    // Scroll chat to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Play alert sound for new bids
    if (newBidAlert && alertAudioRef.current) {
      alertAudioRef.current.play().catch(() => {
        // Audio play failed, ignore
      });
    }
  }, [newBidAlert]);

  const handleQuickBid = () => {
    const nextBid = getNextBidAmount();
    if (canBid(nextBid)) {
      placeBid(nextBid);
    }
  };

  const handleCustomBid = () => {
    const amount = parseInt(customBidAmount) * 1000000; // Convert millions to actual amount
    if (canBid(amount)) {
      placeBid(amount);
      setCustomBidAmount('');
    }
  };

  const handleChatSend = () => {
    if (chatInput.trim()) {
      sendChatMessage(chatInput);
      setChatInput('');
    }
  };

  const getTimerColor = () => {
    if (timeRemaining <= 3) return 'text-red-500';
    if (timeRemaining <= 5) return 'text-orange-500';
    return 'text-green-500';
  };

  const getTotalTimerColor = () => {
    if (totalTimeLeft <= 10) return 'text-red-500';
    if (totalTimeLeft <= 20) return 'text-orange-500';
    return 'text-blue-500';
  };

  if (!isConnected || !currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to auction room...</p>
        </div>
      </div>
    );
  }

  const userParticipant = participants.find(p => p.name === "You");
  const nextBidAmount = getNextBidAmount();
  const maxBid = getMaxBid();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Audio for bid alerts */}
      <audio ref={alertAudioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSEFl" type="audio/wav" />
      </audio>

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Gavel className="mr-2" size={24} />
              {currentAuction?.name}
            </h1>
            <p className="text-red-100 opacity-90">Live Auction Room</p>
          </div>
          
          <Button
            onClick={() => navigate('/auctions')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Leave Auction
          </Button>
        </div>

        {/* Timers */}
        <div className="grid grid-cols-2 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getTimerColor()}`}>
              {timeRemaining}s
            </div>
            <p className="text-white/80 text-sm">Bid Timer</p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getTotalTimerColor()}`}>
              {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-white/80 text-sm">Total Time</p>
          </div>
        </div>
      </div>

      {/* New Bid Alert */}
      {newBidAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg border-2 border-green-300">
            <p className="font-bold">
              🎯 New Bid: {newBidAlert.bidder} - {formatCurrency(newBidAlert.amount)}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        {/* Main Auction Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Player */}
          <Card className="shadow-xl border-2 border-yellow-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6 mb-6">
                <img 
                  src={currentPlayer.image} 
                  alt={currentPlayer.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
                />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900">{currentPlayer.name}</h2>
                  <p className="text-lg text-gray-600">{currentPlayer.team} • {currentPlayer.role}</p>
                  <div className="mt-2">
                    <Badge className="bg-yellow-500 text-white">
                      Base Price: {formatCurrency(currentPlayer.basePrice)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Bid</p>
                  <p className="text-4xl font-bold text-green-600">
                    {formatCurrency(currentPlayer.currentBid)}
                  </p>
                </div>
              </div>

              {/* Player Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{currentPlayer.stats.matches}</p>
                  <p className="text-sm text-gray-600">Matches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{currentPlayer.stats.runs || currentPlayer.stats.wickets}</p>
                  <p className="text-sm text-gray-600">{currentPlayer.role === 'Bowler' ? 'Wickets' : 'Runs'}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{currentPlayer.stats.average}</p>
                  <p className="text-sm text-gray-600">Average</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{currentPlayer.stats.strikeRate}</p>
                  <p className="text-sm text-gray-600">Strike Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bidding Controls */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gavel className="text-blue-500" size={20} />
                <span>Place Your Bid</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userParticipant && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Your Remaining Budget:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(userParticipant.remaining)}
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Bid Button */}
              <div className="space-y-3">
                <Button
                  onClick={handleQuickBid}
                  disabled={!canBid(nextBidAmount)}
                  className={`w-full h-16 text-xl font-bold ${
                    canBid(nextBidAmount) 
                      ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse' 
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  <Zap className="mr-2" size={24} />
                  Quick Bid: {formatCurrency(nextBidAmount)}
                </Button>

                {/* Custom Bid */}
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                    <Input
                      type="number"
                      placeholder="Amount in millions"
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(e.target.value)}
                      className="pl-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">M</span>
                  </div>
                  <Button
                    onClick={handleCustomBid}
                    disabled={!customBidAmount || !canBid(parseInt(customBidAmount) * 1000000)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Bid
                  </Button>
                </div>

                {!canBid(nextBidAmount) && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertCircle size={16} />
                      <span className="text-sm">
                        {userParticipant?.remaining < nextBidAmount 
                          ? 'Insufficient budget for next bid' 
                          : 'Bidding not available'
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bid History */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="text-green-500" size={20} />
                <span>Bid History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {bidHistory.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {bid.bidder.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{bid.bidder}</p>
                        <p className="text-sm text-gray-500">{bid.team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(bid.amount)}</p>
                      <p className="text-xs text-gray-500">
                        {bid.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participants */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="text-blue-500" size={20} />
                  <span>Participants ({participants.length})</span>
                </div>
                <Badge variant="outline" className="border-green-200 text-green-600">
                  {participants.filter(p => p.isOnline).length} Online
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <span className="text-xl">{participant.avatar}</span>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                          participant.isOnline ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {participant.name}
                          {participant.name === "You" && <Crown className="inline ml-1 w-3 h-3 text-yellow-500" />}
                        </p>
                        <p className="text-xs text-gray-500">{participant.team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-green-600">
                        {formatCurrency(participant.remaining)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="text-purple-500" size={20} />
                  <span>Live Chat</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                >
                  <Eye size={16} />
                </Button>
              </CardTitle>
            </CardHeader>
            {showChat && (
              <CardContent className="space-y-4">
                <div className="h-48 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-2">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex items-start space-x-2 ${
                      message.isOwn ? 'justify-end' : 'justify-start'
                    }`}>
                      <div className={`max-w-xs p-2 rounded-lg ${
                        message.isOwn 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        <p className="text-xs font-medium mb-1">
                          {message.user}
                        </p>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleChatSend}
                    disabled={!chatInput.trim()}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;