import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, Users, MessageCircle, Send, Gavel, TrendingUp, 
  Crown, Timer, AlertCircle, Zap, Eye, User, Menu, X
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [customBidAmount, setCustomBidAmount] = useState('');
  const [activeTab, setActiveTab] = useState('participants'); // participants or chat
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4">
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

      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold flex items-center truncate">
              <Gavel className="mr-2 flex-shrink-0" size={20} />
              <span className="truncate">{currentAuction?.name}</span>
            </h1>
            <p className="text-red-100 opacity-90 text-sm">Live Auction Room</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Mobile Sidebar Toggle */}
            <Button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              variant="outline"
              size="sm"
              className="lg:hidden border-white/30 text-white hover:bg-white/10"
            >
              <Menu size={16} />
            </Button>
            
            <Button
              onClick={() => navigate('/auctions')}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <span className="hidden sm:inline">Leave Auction</span>
              <X size={16} className="sm:hidden" />
            </Button>
          </div>
        </div>

        {/* Mobile Timers */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
          <div className="text-center">
            <div className={`text-2xl sm:text-3xl font-bold ${getTimerColor()}`}>
              {timeRemaining}s
            </div>
            <p className="text-white/80 text-xs sm:text-sm">Bid Timer</p>
          </div>
          <div className="text-center">
            <div className={`text-2xl sm:text-3xl font-bold ${getTotalTimerColor()}`}>
              {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-white/80 text-xs sm:text-sm">Total Time</p>
          </div>
        </div>
      </div>

      {/* New Bid Alert - Mobile Optimized */}
      {newBidAlert && (
        <div className="fixed top-20 left-4 right-4 z-50 animate-pulse">
          <div className="bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg border-2 border-green-300 text-center">
            <p className="font-bold text-sm sm:text-base">
              🎯 New Bid: {newBidAlert.bidder} - {formatCurrency(newBidAlert.amount)}
            </p>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-6 p-2 sm:p-4">
        {/* Main Auction Area */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Current Player - Mobile Optimized */}
          <Card className="shadow-xl border-2 border-yellow-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-6 mb-4 sm:mb-6">
                <img 
                  src={currentPlayer.image} 
                  alt={currentPlayer.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-yellow-400 mb-4 sm:mb-0"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{currentPlayer.name}</h2>
                  <p className="text-base sm:text-lg text-gray-600">{currentPlayer.team} • {currentPlayer.role}</p>
                  <div className="mt-2">
                    <Badge className="bg-yellow-500 text-white text-xs sm:text-sm">
                      Base: {formatCurrency(currentPlayer.basePrice)}
                    </Badge>
                  </div>
                </div>
                <div className="text-center sm:text-right mt-4 sm:mt-0">
                  <p className="text-xs sm:text-sm text-gray-600">Current Bid</p>
                  <p className="text-2xl sm:text-4xl font-bold text-green-600">
                    {formatCurrency(currentPlayer.currentBid)}
                  </p>
                </div>
              </div>

              {/* Player Stats - Mobile Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 bg-gray-50 rounded-xl p-3 sm:p-4">
                <div className="text-center">
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{currentPlayer.stats.matches}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Matches</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-2xl font-bold text-green-600">{currentPlayer.stats.runs || currentPlayer.stats.wickets}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{currentPlayer.role === 'Bowler' ? 'Wickets' : 'Runs'}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">{currentPlayer.stats.average}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Average</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{currentPlayer.stats.strikeRate}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Strike Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bidding Controls - Mobile Optimized */}
          <Card className="shadow-xl">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Gavel className="text-blue-500" size={18} />
                <span>Place Your Bid</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {userParticipant && (
                <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Your Budget:</span>
                    <span className="text-base sm:text-lg font-bold text-blue-600">
                      {formatCurrency(userParticipant.remaining)}
                    </span>
                  </div>
                </div>
              )}

              {/* Mobile-Optimized Bidding Controls */}
              <div className="space-y-3">
                {/* Quick Bid Button - Larger for Mobile */}
                <Button
                  onClick={handleQuickBid}
                  disabled={!canBid(nextBidAmount)}
                  className={`w-full h-14 sm:h-16 text-lg sm:text-xl font-bold ${
                    canBid(nextBidAmount) 
                      ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse' 
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  <Zap className="mr-2" size={20} />
                  Quick Bid: {formatCurrency(nextBidAmount)}
                </Button>

                {/* Custom Bid - Mobile Layout */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                    <Input
                      type="number"
                      placeholder="Amount in millions"
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(e.target.value)}
                      className="pl-8 h-12 text-base"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">M</span>
                  </div>
                  <Button
                    onClick={handleCustomBid}
                    disabled={!customBidAmount || !canBid(parseInt(customBidAmount) * 1000000)}
                    className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-6"
                  >
                    Bid
                  </Button>
                </div>

                {!canBid(nextBidAmount) && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertCircle size={16} />
                      <span className="text-xs sm:text-sm">
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

          {/* Bid History - Mobile Optimized */}
          <Card className="shadow-xl lg:block">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <TrendingUp className="text-green-500" size={18} />
                <span>Bid History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-48 sm:max-h-64 overflow-y-auto">
              <div className="space-y-2 sm:space-y-3">
                {bidHistory.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                        {bid.bidder.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{bid.bidder}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{bid.team}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-green-600 text-sm sm:text-base">{formatCurrency(bid.amount)}</p>
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

        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileSidebar(false)}></div>
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
              <MobileSidebar 
                participants={participants}
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleChatSend={handleChatSend}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onClose={() => setShowMobileSidebar(false)}
                chatEndRef={chatEndRef}
              />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block space-y-6">
          <DesktopSidebar 
            participants={participants}
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleChatSend={handleChatSend}
            chatEndRef={chatEndRef}
          />
        </div>
      </div>

      {/* Mobile Bottom Tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => {
              setActiveTab('participants');
              setShowMobileSidebar(true);
            }}
            className="flex flex-col items-center space-y-1 p-2"
          >
            <Users size={20} className="text-blue-500" />
            <span className="text-xs text-gray-600">Players</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('chat');
              setShowMobileSidebar(true);
            }}
            className="flex flex-col items-center space-y-1 p-2"
          >
            <MessageCircle size={20} className="text-purple-500" />
            <span className="text-xs text-gray-600">Chat</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-16 lg:hidden"></div>
    </div>
  );
};

// Mobile Sidebar Component
const MobileSidebar = ({ 
  participants, 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleChatSend, 
  activeTab, 
  setActiveTab, 
  onClose,
  chatEndRef 
}) => (
  <div className="h-full flex flex-col">
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('participants')}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            activeTab === 'participants' 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users size={16} className="inline mr-1" />
          Participants
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            activeTab === 'chat' 
              ? 'bg-purple-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MessageCircle size={16} className="inline mr-1" />
          Chat
        </button>
      </div>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X size={16} />
      </Button>
    </div>

    {activeTab === 'participants' ? (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <span className="text-xl">{participant.avatar}</span>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                    participant.isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {participant.name}
                    {participant.name === "You" && <Crown className="inline ml-1 w-3 h-3 text-yellow-500" />}
                  </p>
                  <p className="text-sm text-gray-500">{participant.team}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  {formatCurrency(participant.remaining)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
        
        <div className="p-4 border-t">
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
        </div>
      </div>
    )}
  </div>
);

// Desktop Sidebar Component
const DesktopSidebar = ({ 
  participants, 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleChatSend, 
  chatEndRef 
}) => (
  <>
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
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="text-purple-500" size={20} />
          <span>Live Chat</span>
        </CardTitle>
      </CardHeader>
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
    </Card>
  </>
);

export default AuctionRoom;