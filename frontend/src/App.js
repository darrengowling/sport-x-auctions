import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

// Components
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Auctions from "./pages/Auctions";
import AuctionRoom from "./pages/AuctionRoom";
import Teams from "./pages/Teams";
import Leagues from "./pages/Leagues";
import Profile from "./pages/Profile";
import { Toaster } from "./components/ui/toaster";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log('Backend connected:', response.data.message);
    } catch (e) {
      console.error('Backend connection failed:', e);
    }
  };

  useEffect(() => {
    testBackendConnection();
    // Simulate user loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold text-white mb-2">Sports X</h1>
          <p className="text-blue-200">Loading your pro cricket auction experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App bg-slate-50 min-h-screen">
      <BrowserRouter>
        <div className="pb-20"> {/* Bottom padding for navigation */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/auction/:id" element={<AuctionRoom />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <Navigation />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;