import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gavel, Clock, Users, TrendingUp, Trophy, Crown, 
  Play, Pause, User, MessageCircle, AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../contexts/ToastContext';
import auctionWebSocket from '../services/auctionWebSocket';

const LiveAuctionTest = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();
  
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  
  // Auction state
  const [currentAuction, setCurrentAuction] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [userBudget, setUserBudget] = useState(100000000);
  
  // UI state
  const [bidAmount, setBidAmount] = useState('');
  const [connectionLog, setConnectionLog] = useState([]);
  const [showConnectionLog, setShowConnectionLog] = useState(false);

  // Generate random user info for testing
  useEffect(() => {
    const randomId = `user_${Math.random().toString(36).substr(2, 8)}`;
    const randomUsername = `TestUser${Math.floor(Math.random() * 1000)}`;
    setUserId(randomId);
    setUsername(randomUsername);
  }, []);

  // Set up WebSocket event listeners
  useEffect(() => {
    const addLog = (message) => {
      setConnectionLog(prev => [...prev.slice(-19), {
        timestamp: new Date().toLocaleTimeString(),
        message: message
      }]);
    };

    // Connection events
    auctionWebSocket.on('connected', (data) => {
      setIsConnected(true);
      addLog(`Connected to room ${data.roomId}`);
      showSuccess('Connected to auction room!');
    });

    auctionWebSocket.on('disconnected', (data) => {
      setIsConnected(false);
      addLog(`Disconnected from room (Code: ${data.code})`);
      showWarning('Disconnected from auction room');
    });

    auctionWebSocket.on('connectionConfirmed', (data) => {
      setUserBudget(data.budget);
      addLog(`Connection confirmed - Budget: £${data.budget.toLocaleString()}`);
    });

    // User events
    auctionWebSocket.on('userJoined', (data) => {
      addLog(`${data.username} joined the room`);
      setParticipants(prev => [...prev, { id: data.user_id, username: data.username }]);
    });

    auctionWebSocket.on('userLeft', (data) => {
      addLog(`${data.username} left the room`);
      setParticipants(prev => prev.filter(p => p.id !== data.user_id));
    });

    // Auction events
    auctionWebSocket.on('auctionStarted', (data) => {
      setCurrentAuction(data.auction);
      setBidHistory([]);
      addLog(`Auction started for ${data.auction.player_name}`);
      showSuccess(`Auction started for ${data.auction.player_name}!`);
    });

    auctionWebSocket.on('bidPlaced', (data) => {
      setCurrentAuction(prev => ({
        ...prev,
        current_bid: data.auction_state.current_bid,
        minimum_next_bid: data.auction_state.minimum_next_bid,
        current_winner_username: data.auction_state.current_winner,
        total_bids: data.auction_state.total_bids,
        time_remaining: data.auction_state.time_remaining
      }));
      
      setBidHistory(prev => [data.bid, ...prev.slice(0, 9)]);
      addLog(`${data.bid.username} bid £${data.bid.amount.toLocaleString()}`);
    });

    auctionWebSocket.on('bidConfirmed', (data) => {
      setUserBudget(data.new_budget);
      showSuccess(data.message);
      addLog(`Your bid confirmed - Remaining budget: £${data.new_budget.toLocaleString()}`);
    });

    auctionWebSocket.on('bidError', (data) => {
      showError(data.message);
      addLog(`Bid error: ${data.message}`);
    });

    auctionWebSocket.on('timerUpdate', (data) => {
      setCurrentAuction(prev => prev ? {
        ...prev,
        time_remaining: data.time_remaining
      } : null);
    });

    auctionWebSocket.on('auctionEnded', (data) => {
      const result = data.auction_result;
      if (result.winner_username) {
        addLog(`Auction ended - Winner: ${result.winner_username} (£${result.winning_bid.toLocaleString()})`);
        showSuccess(`${result.player_name} sold to ${result.winner_username} for £${result.winning_bid.toLocaleString()}!`);
      } else {
        addLog(`Auction ended - No bids received`);
        showWarning(`${result.player_name} went unsold`);
      }
      setCurrentAuction(null);
      setBidHistory([]);
    });

    auctionWebSocket.on('roomState', (data) => {
      setUserBudget(data.user_budget);
      if (data.current_auction) {
        setCurrentAuction(data.current_auction);
      }
      if (data.bid_history) {
        setBidHistory(data.bid_history);
      }
      addLog(`Room state updated`);
    });

    auctionWebSocket.on('error', (data) => {
      addLog(`Error: ${data.message || 'Unknown error'}`);
      showError(data.message || 'Connection error occurred');
    });

    return () => {
      // Clean up event listeners
      ['connected', 'disconnected', 'connectionConfirmed', 'userJoined', 'userLeft', 
       'auctionStarted', 'bidPlaced', 'bidConfirmed', 'bidError', 'timerUpdate', 
       'auctionEnded', 'roomState', 'error'].forEach(event => {
        auctionWebSocket.off(event);
      });
    };
  }, [showSuccess, showError, showWarning]);

  const handleConnect = () => {
    if (!roomId.trim()) {
      showError('Please enter a room ID');
      return;
    }
    
    auctionWebSocket.connect(roomId.trim(), userId, username);
  };

  const handleDisconnect = () => {
    auctionWebSocket.disconnect();
    setIsConnected(false);
    setCurrentAuction(null);
    setBidHistory([]);
    setParticipants([]);
  };

  const handlePlaceBid = () => {
    const amount = parseInt(bidAmount);
    
    if (!amount || amount <= 0) {
      showError('Please enter a valid bid amount');
      return;
    }

    if (amount > userBudget) {
      showError('Insufficient budget for this bid');
      return;
    }

    if (currentAuction && amount < currentAuction.minimum_next_bid) {
      showError(`Minimum bid is £${currentAuction.minimum_next_bid.toLocaleString()}`);
      return;
    }

    auctionWebSocket.placeBid(amount);
    setBidAmount('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏏 Live Auction Test
          </h1>
          <p className="text-slate-300 text-lg">
            Test real-time bidding with multiple users
          </p>
        </div>

        {/* Connection Panel */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Connection</span>
              <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-500" : "bg-red-500"}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Room ID (use: room_6c05bb4c)
                </label>
                <Input
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  disabled={isConnected}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    User: {username} (ID: {userId.slice(-8)})
                  </label>
                  <p className="text-sm text-slate-400">
                    Budget: £{userBudget.toLocaleString()}
                  </p>
                </div>
                
                <Button
                  onClick={isConnected ? handleDisconnect : handleConnect}
                  className={`px-6 ${isConnected 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Auction */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Gavel className="w-5 h-5 text-yellow-500" />
                <span>Current Auction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentAuction ? (
                <div className="space-y-4">
                  {/* Player Info */}
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg">
                    <img 
                      src={currentAuction.player_image} 
                      alt={currentAuction.player_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{currentAuction.player_name}</h3>
                      <p className="text-slate-300">{currentAuction.player_team} • {currentAuction.player_position}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-2 text-yellow-500">
                        <Clock className="w-5 h-5" />
                        <span className="text-2xl font-bold">
                          {formatTime(currentAuction.time_remaining)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">Time Left</p>
                    </div>
                  </div>

                  {/* Bidding Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-500/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">
                        £{currentAuction.current_bid.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-400">Current Bid</p>
                    </div>
                    <div className="text-center p-3 bg-blue-500/20 rounded-lg">
                      <p className="text-lg font-bold text-blue-400">
                        {currentAuction.current_winner_username || 'No bids'}
                      </p>
                      <p className="text-sm text-slate-400">Leading Bidder</p>
                    </div>
                  </div>

                  {/* Bidding Controls */}
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min: £${currentAuction.minimum_next_bid.toLocaleString()}`}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      onClick={handlePlaceBid}
                      disabled={!isConnected}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold px-8"
                    >
                      Place Bid
                    </Button>
                  </div>

                  {/* Quick Bid Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 5].map(multiplier => {
                      const quickBid = currentAuction.minimum_next_bid + (multiplier * 1000000);
                      return (
                        <Button
                          key={multiplier}
                          onClick={() => setBidAmount(quickBid.toString())}
                          variant="outline"
                          size="sm"
                          className="text-white border-slate-600 hover:bg-slate-700"
                        >
                          +£{multiplier}M
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">No active auction</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Connect to a room and start an auction to begin bidding
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bid History & Activity */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Live Activity</span>
                </div>
                <Button
                  onClick={() => setShowConnectionLog(!showConnectionLog)}
                  variant="outline"
                  size="sm"
                  className="text-white border-slate-600"
                >
                  {showConnectionLog ? 'Bids' : 'Logs'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto space-y-2">
                {showConnectionLog ? (
                  // Connection Log
                  connectionLog.length > 0 ? (
                    connectionLog.slice().reverse().map((entry, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-slate-700/30 rounded text-sm">
                        <span className="text-slate-400 min-w-0 flex-shrink-0">{entry.timestamp}</span>
                        <span className="text-slate-300">{entry.message}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-8">No activity logs yet</p>
                  )
                ) : (
                  // Bid History
                  bidHistory.length > 0 ? (
                    bidHistory.map((bid, index) => (
                      <div key={bid.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{bid.username}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(bid.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-400">£{bid.amount.toLocaleString()}</p>
                          {bid.is_winning && (
                            <Badge variant="default" className="bg-yellow-500 text-slate-900 text-xs">
                              Winning
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-8">No bids placed yet</p>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">How to Test Multi-User Bidding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-300 space-y-2">
              <p><strong>1.</strong> Open this page in multiple browser tabs/windows</p>
              <p><strong>2.</strong> Connect each tab to the same room ID: <code className="bg-slate-700 px-2 py-1 rounded">room_6c05bb4c</code></p>
              <p><strong>3.</strong> Start an auction from the backend: <code className="bg-slate-700 px-2 py-1 rounded">POST /api/auctions/rooms/room_6c05bb4c/start-auction</code></p>
              <p><strong>4.</strong> Place bids from different tabs to see real-time updates</p>
              <p><strong>5.</strong> Watch the timer, bid history, and winner updates in real-time</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveAuctionTest;