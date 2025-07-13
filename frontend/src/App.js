import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";

// Components
import Navigation from "./components/Navigation";
import ScrollToTop from "./components/ScrollToTop";
import SplashHandler from "./pages/SplashHandler";
import SplashPage from "./pages/SplashPage";
import HowItWorks from "./pages/HowItWorks";
import Home from "./pages/Home";
import Auctions from "./pages/Auctions";
import AuctionRoom from "./pages/AuctionRoom";
import Teams from "./pages/Teams";
import Leagues from "./pages/Leagues";
import Profile from "./pages/Profile";
import { Toaster } from "./components/ui/toaster";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AppLayout = ({ children }) => (
  <>
    <Navigation />
    <div className="pt-2">
      {children}
    </div>
  </>
);

function App() {
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
    // Quick backend connection test - reduce loading time
    setTimeout(() => {
      setLoading(false);
    }, 500);
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
    <AuthProvider>
      <div className="App bg-slate-50 min-h-screen">
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Root route - check splash status */}
            <Route path="/" element={<SplashHandler />} />
            
            {/* Splash page - always accessible */}
            <Route path="/splash" element={<SplashPage />} />
            
            {/* How it works page - no navigation */}
            <Route path="/how-it-works" element={<HowItWorks />} />
            
            {/* Main app routes */}
            <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
            <Route path="/auctions" element={<AppLayout><Auctions /></AppLayout>} />
            <Route path="/auction/:id" element={<AppLayout><AuctionRoom /></AppLayout>} />
            <Route path="/teams" element={<AppLayout><Teams /></AppLayout>} />
            <Route path="/leagues" element={<AppLayout><Leagues /></AppLayout>} />
            <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;