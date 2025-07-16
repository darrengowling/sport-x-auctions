import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Gavel, Trophy, Target, Gift, Heart, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HowItWorks = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const steps = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Join Your Peer Group",
      description: "Sign up and get matched with like-minded sports fans in small, competitive groups",
      color: "bg-blue-500",
      action: () => {
        if (isAuthenticated) {
          navigate('/home');
        } else {
          navigate('/splash'); // Navigate back to splash for authentication
        }
      },
      actionText: isAuthenticated ? "Go to Dashboard" : "Sign Up Now"
    },
    {
      icon: <Gavel className="w-8 h-8" />,
      title: "Bid in Live Auctions",
      description: "Compete for exclusive ownership of real teams and players across cricket, rugby, tennis, golf, and football",
      color: "bg-purple-500",
      action: () => navigate('/auctions'),
      actionText: "Browse Auctions"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Track Live Performance",
      description: "Your owned players and teams score points based on real-world performance with live updates",
      color: "bg-green-500",
      action: () => navigate('/teams'),
      actionText: "View Teams"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Compete & Win",
      description: "Climb the leaderboards and win rewards - play for fun, cash prizes, or charity fundraising",
      color: "bg-orange-500",
      action: () => navigate('/leagues'),
      actionText: "Join Leagues"
    }
  ];

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Peer-to-Peer Gaming",
      description: "Small groups, big competition",
      action: () => {
        if (isAuthenticated) {
          navigate('/leagues');
        } else {
          navigate('/splash');
        }
      }
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Real-Time Scoring",
      description: "Live updates as sports happen",
      action: () => {
        if (isAuthenticated) {
          navigate('/auctions');
        } else {
          navigate('/splash');
        }
      }
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Custom Tournaments",
      description: "Create your own competitions",
      action: () => {
        if (isAuthenticated) {
          navigate('/leagues');
        } else {
          navigate('/splash');
        }
      }
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Play for Good",
      description: "Fun, cash, or charity options",
      action: () => {
        if (isAuthenticated) {
          navigate('/leagues');
        } else {
          navigate('/splash');
        }
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">SX</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Sport X</h1>
              <p className="text-slate-300 text-sm">How It Works</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/home')}
            className="text-slate-300 hover:text-white transition-colors"
          >
            Skip →
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How Sport X Works
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            A unique peer-to-peer social gaming platform where you bid for exclusive ownership 
            of teams and players, compete in small groups, and win based on real sports performance.
          </p>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">The Big Idea</h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Sport X provides sports fans with a platform they can truly engage with via personal 
              'ownership' of competing teams and players. Decide which sports and competitions you 
              wish to engage with and which prizes to play for - all in a safe, fun environment.
            </p>
          </div>
        </div>

        {/* Interactive Get Started Flow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Get Started in 4 Easy Steps</h2>
          <p className="text-slate-300 text-center mb-12">Click on each step to explore that part of the app</p>
          
          {/* Desktop Flow */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Connection Lines */}
              <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-orange-500 opacity-30"></div>
              
              <div className="grid grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="text-center">
                      {/* Step Icon */}
                      <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4 relative z-10 cursor-pointer hover:scale-110 transition-transform`}>
                        {step.icon}
                      </div>
                      
                      {/* Step Number */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold text-sm z-20">
                        {index + 1}
                      </div>
                      
                      {/* Content */}
                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mt-4 hover:bg-slate-800/70 transition-colors">
                        <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">{step.description}</p>
                        
                        {/* Interactive Button */}
                        <button
                          onClick={step.action}
                          className={`${step.color} hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2 mx-auto shadow-lg`}
                        >
                          <Play className="w-4 h-4" />
                          <span>{step.actionText}</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-8 -right-4 text-slate-400 z-10">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Flow */}
          <div className="md:hidden space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-start space-x-4">
                  <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 relative`}>
                    {step.icon}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">
                      {index + 1}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 flex-1">
                    <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{step.description}</p>
                    
                    {/* Interactive Button */}
                    <button
                      onClick={step.action}
                      className={`${step.color} hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 flex items-center space-x-2`}
                    >
                      <Play className="w-4 h-4" />
                      <span>{step.actionText}</span>
                    </button>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-slate-400 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Makes Sport X Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-slate-800/70 transition-all cursor-pointer transform hover:scale-105"
                onClick={feature.action}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Play Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Choose Your Playing Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-green-500/30 hover:bg-slate-800/70 transition-all cursor-pointer transform hover:scale-105"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/leagues');
                } else {
                  navigate('/splash');
                }
              }}
            >
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-white font-bold text-xl mb-3">For Fun</h3>
              <p className="text-slate-300 mb-4">Play casually with friends and enjoy the thrill of competition without stakes</p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                {isAuthenticated ? 'Start Free Play' : 'Sign Up for Free Play'}
              </button>
            </div>
            <div 
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-yellow-500/30 hover:bg-slate-800/70 transition-all cursor-pointer transform hover:scale-105"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/leagues');
                } else {
                  navigate('/splash');
                }
              }}
            >
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-white font-bold text-xl mb-3">For Cash</h3>
              <p className="text-slate-300 mb-4">Compete for real prizes and cash rewards in competitive tournaments</p>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                {isAuthenticated ? 'Join Cash Leagues' : 'Sign Up for Cash Leagues'}
              </button>
            </div>
            <div 
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-pink-500/30 hover:bg-slate-800/70 transition-all cursor-pointer transform hover:scale-105"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/leagues');
                } else {
                  navigate('/splash');
                }
              }}
            >
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-white font-bold text-xl mb-3">For Charity</h3>
              <p className="text-slate-300 mb-4">Raise funds for good causes while enjoying your passion for sports</p>
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                {isAuthenticated ? 'Support Charity' : 'Sign Up for Charity'}
              </button>
            </div>
          </div>
        </div>

        {/* Sports Coverage */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Multiple Sports, Endless Possibilities</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['🏏 Cricket', '🏈 Rugby', '🎾 Tennis', '⛳ Golf', '⚽ Football'].map((sport, index) => (
              <div 
                key={index} 
                className="bg-slate-800/50 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-slate-800/70 transition-all cursor-pointer transform hover:scale-105"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/auctions');
                  } else {
                    navigate('/splash');
                  }
                }}
              >
                <span className="text-white font-medium">{sport}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Own the Game?</h2>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Join thousands of sports fans who are already experiencing the thrill of true ownership in sports gaming.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/auctions');
                  } else {
                    navigate('/splash');
                  }
                }}
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                {isAuthenticated ? 'Start Bidding Now' : 'Sign Up to Bid'}
              </button>
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/leagues');
                  } else {
                    navigate('/splash');
                  }
                }}
                className="bg-green-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105"
              >
                {isAuthenticated ? 'Create Your League' : 'Join to Create League'}
              </button>
              <button 
                onClick={() => navigate('/')}
                className="border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-all"
              >
                Back to Splash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;