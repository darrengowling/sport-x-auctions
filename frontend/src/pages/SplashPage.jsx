import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Users, Trophy, Target, Zap, Shield, Heart, ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';

const SplashPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Check if this is accessed directly (not from root)
  const isDirectAccess = location.pathname === '/splash';

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      icon: Target,
      title: "Strategy Over Luck",
      subtitle: "Where skill beats chance",
      description: "Use knowledge and tactics to outperform opponents. Victory based on smarts, not chance."
    },
    {
      icon: Users,
      title: "Social Arena",
      subtitle: "Compete with friends",
      description: "Challenge friends in real-time matchups. Build communities through shared passion and friendly competition."
    },
    {
      icon: Shield,
      title: "Fair Play",
      subtitle: "Transparency & integrity",
      description: "A level playing field for passionate tacticians, bold thinkers, and everyday fans chasing the next big win."
    }
  ];

  const currentSlideData = slides[currentSlide];
  const CurrentIcon = currentSlideData.icon;

  const handleEnterArena = () => {
    // Navigate to how it works page instead of directly to home
    navigate('/how-it-works');
  };

  const handleCreateAccount = () => {
    // Navigate to how it works page
    navigate('/how-it-works');
  };

  const handleSignIn = () => {
    // Navigate to how it works page
    navigate('/how-it-works');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-purple-500/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-12 w-28 h-28 bg-pink-500/10 rounded-full blur-xl animate-bounce"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Back Button - only show if accessed directly */}
        {isDirectAccess && (
          <div className="absolute top-4 left-4 z-20">
            <button 
              onClick={() => navigate('/home')}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors text-white"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className={`text-center pt-16 pb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">SX</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Sport X
          </h1>
          
          <p className="text-xl text-blue-200 font-medium mb-2">
            Sports gaming with friends
          </p>
          
          <div className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
            No gambling. All game.
          </div>
        </div>

        {/* Main Content - Sliding Cards */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl transform transition-all duration-700 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <CurrentIcon className="text-white" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentSlideData.title}
                  </h2>
                  <p className="text-blue-200 font-medium mb-4">
                    {currentSlideData.subtitle}
                  </p>
                </div>
                
                <p className="text-gray-200 text-sm leading-relaxed mb-6">
                  {currentSlideData.description}
                </p>

                {/* Slide Indicators */}
                <div className="flex justify-center space-x-2 mb-6">
                  {slides.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-blue-400 scale-125' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Messages */}
        <div className="px-6 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              The arena where instinct meets insight
            </h3>
            <p className="text-blue-200 text-lg mb-6 max-w-md mx-auto leading-relaxed">
              Where fans don't just spectate—they strategize, socialize, and stake their claim.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <Zap className="text-yellow-400" size={20} />
                <span className="text-white font-medium text-sm">Real-time tournaments</span>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <Trophy className="text-orange-400" size={20} />
                <span className="text-white font-medium text-sm">Build dream teams</span>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <Heart className="text-red-400" size={20} />
                <span className="text-white font-medium text-sm">Climb leaderboards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="px-6 pb-12">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-white mb-2">
              Own the moment. Outbid the ordinary.
            </h4>
            <p className="text-blue-200 text-sm mb-6">
              No bets. No chance. Just you, the game, and bragging rights.
            </p>
          </div>

          <div className="space-y-3 max-w-sm mx-auto">
            {/* Primary Action - Create Account */}
            <Button 
              onClick={handleCreateAccount}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-2xl transform transition-all duration-200 hover:scale-105"
            >
              <UserPlus size={18} className="mr-2" />
              <span>Create Account</span>
            </Button>

            {/* Secondary Action - Sign In */}
            <Button 
              onClick={handleSignIn}
              variant="outline"
              className="w-full border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 rounded-xl backdrop-blur-sm"
            >
              <LogIn size={18} className="mr-2" />
              <span>Sign In</span>
            </Button>
            
            {/* Tertiary Action - Continue as Guest */}
            <button 
              onClick={handleEnterArena}
              className="w-full text-blue-200 font-medium py-3 text-sm hover:text-white transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="text-center pb-6 px-6">
          <p className="text-xs text-blue-300/70 max-w-xs mx-auto leading-relaxed">
            This is where play has purpose. Where community fuels ambition. 
            Where the future of social sports lives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;