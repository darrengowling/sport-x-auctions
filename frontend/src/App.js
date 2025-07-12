import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Components
import Navigation from "./components/Navigation";
import SplashPage from "./pages/SplashPage";
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
          <h1 className="text-3xl font-bold text-white mb-2">Sport X</h1>
          <p className="text-blue-200">Loading your pro cricket auction experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App bg-slate-50 min-h-screen">
      <BrowserRouter>
        <Routes>
          {/* Splash route */}
          <Route path="/splash" element={<SplashPage />} />
          
          {/* Main app routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={
            <>
              <div className="pb-20">
                <Home />
              </div>
              <Navigation />
            </>
          } />
          <Route path="/auctions" element={
            <>
              <div className="pb-20">
                <Auctions />
              </div>
              <Navigation />
            </>
          } />
          <Route path="/auction/:id" element={
            <>
              <div className="pb-20">
                <AuctionRoom />
              </div>
              <Navigation />
            </>
          } />
          <Route path="/teams" element={
            <>
              <div className="pb-20">
                <Teams />
              </div>
              <Navigation />
            </>
          } />
          <Route path="/leagues" element={
            <>
              <div className="pb-20">
                <Leagues />
              </div>
              <Navigation />
            </>
          } />
          <Route path="/profile" element={
            <>
              <div className="pb-20">
                <Profile />
              </div>
              <Navigation />
            </>
          } />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;