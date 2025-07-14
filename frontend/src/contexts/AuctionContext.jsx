import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const AuctionContext = createContext();

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};

export const AuctionProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentAuction, setCurrentAuction] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [totalTimeLeft, setTotalTimeLeft] = useState(60);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newBidAlert, setNewBidAlert] = useState(null);
  
  const wsRef = useRef(null);
  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);

  // Simulated WebSocket connection (in production, this would be a real WebSocket)
  const connectToAuction = (auctionId) => {
    setIsConnected(true);
    
    // Mock auction data
    const mockAuction = {
      id: auctionId,
      name: "IPL 2025 Mega Auction",
      status: "live"
    };
    
    const mockPlayer = {
      id: 1,
      name: "David Warner",
      team: "SRH",
      role: "Batsman",
      basePrice: 2000000,
      currentBid: 15000000,
      image: "https://images.unsplash.com/photo-1599982946086-eb42d9e14eb8?w=400&h=400&fit=crop&crop=face",
      stats: {
        matches: 230,
        runs: 7263,
        average: 37.25,
        strikeRate: 131.97,
        centuries: 7,
        fifties: 50
      }
    };
    
    const mockParticipants = [
      { id: 1, name: "You", team: "Team Alpha", budget: 25000000, remaining: 8000000, avatar: "🏆", isOnline: true },
      { id: 2, name: "Alex Kumar", team: "Thunderbolts", budget: 50000000, remaining: 12000000, avatar: "⚡", isOnline: true },
      { id: 3, name: "Priya Singh", team: "Storm Kings", budget: 50000000, remaining: 15000000, avatar: "👑", isOnline: true },
      { id: 4, name: "Raj Patel", team: "Fire Dragons", budget: 45000000, remaining: 18000000, avatar: "🐉", isOnline: false },
      { id: 5, name: "Sarah Williams", team: "Lightning Bolts", budget: 40000000, remaining: 22000000, avatar: "⚡", isOnline: true }
    ];
    
    const mockBidHistory = [
      { id: 1, bidder: "Alex Kumar", team: "Thunderbolts", amount: 15000000, timestamp: new Date(Date.now() - 30000) },
      { id: 2, bidder: "Priya Singh", team: "Storm Kings", amount: 14000000, timestamp: new Date(Date.now() - 45000) },
      { id: 3, bidder: "You", team: "Team Alpha", amount: 13000000, timestamp: new Date(Date.now() - 60000) }
    ];
    
    setCurrentAuction(mockAuction);
    setCurrentPlayer(mockPlayer);
    setParticipants(mockParticipants);
    setBidHistory(mockBidHistory);
    setTimeRemaining(10);
    setTotalTimeLeft(60);
    
    startTimers();
  };

  const disconnectFromAuction = () => {
    setIsConnected(false);
    setCurrentAuction(null);
    setCurrentPlayer(null);
    setBidHistory([]);
    setParticipants([]);
    setChatMessages([]);
    stopTimers();
  };

  const startTimers = () => {
    // Bid countdown timer (10 seconds)
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Timer expired, auction moves to next player or ends
          setTotalTimeLeft(prevTotal => {
            if (prevTotal <= 10) {
              // Total time expired, end auction
              return 0;
            }
            return prevTotal - 10;
          });
          return 10; // Reset bid timer
        }
        return prev - 1;
      });
    }, 1000);

    // Total auction timer (60 seconds per player)
    totalTimerRef.current = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          // Auction ended
          stopTimers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (totalTimerRef.current) {
      clearInterval(totalTimerRef.current);
      totalTimerRef.current = null;
    }
  };

  const placeBid = (amount) => {
    if (!currentPlayer || !user) return false;

    const userParticipant = participants.find(p => p.name === "You");
    if (!userParticipant || userParticipant.remaining < amount) {
      return false; // Insufficient budget
    }

    // Create new bid
    const newBid = {
      id: bidHistory.length + 1,
      bidder: user.firstName || user.name || "You",
      team: userParticipant.team,
      amount: amount,
      timestamp: new Date()
    };

    // Update bid history
    setBidHistory(prev => [newBid, ...prev]);

    // Update current player bid
    setCurrentPlayer(prev => ({
      ...prev,
      currentBid: amount
    }));

    // Update participant remaining budget
    setParticipants(prev => prev.map(p => 
      p.name === "You" 
        ? { ...p, remaining: p.remaining - (amount - currentPlayer.currentBid) }
        : p
    ));

    // Reset bid timer
    setTimeRemaining(10);

    // Show bid alert
    setNewBidAlert({
      bidder: newBid.bidder,
      amount: amount,
      timestamp: new Date()
    });

    // Clear alert after 3 seconds
    setTimeout(() => setNewBidAlert(null), 3000);

    return true;
  };

  const sendChatMessage = (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      user: user?.firstName || user?.name || "You",
      message: message.trim(),
      timestamp: new Date(),
      isOwn: true
    };

    setChatMessages(prev => [...prev, newMessage]);

    // Simulate other users' messages occasionally
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        const randomMessages = [
          "Great player!",
          "This is getting expensive!",
          "I'm out",
          "Good luck everyone!",
          "Strong bid!",
          "Worth every penny"
        ];
        
        const botMessage = {
          id: chatMessages.length + 2,
          user: randomParticipant.name,
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
          isOwn: false
        };
        
        setChatMessages(prev => [...prev, botMessage]);
      }, 1000 + Math.random() * 3000);
    }
  };

  const getMaxBid = () => {
    if (!currentPlayer || !user) return 0;
    const userParticipant = participants.find(p => p.name === "You");
    return userParticipant ? userParticipant.remaining : 0;
  };

  const getNextBidAmount = () => {
    if (!currentPlayer) return 0;
    return currentPlayer.currentBid + 1000000; // £1M increment
  };

  const canBid = (amount) => {
    const userParticipant = participants.find(p => p.name === "You");
    return userParticipant && userParticipant.remaining >= amount && amount > currentPlayer?.currentBid;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimers();
    };
  }, []);

  const value = {
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
  };

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  );
};