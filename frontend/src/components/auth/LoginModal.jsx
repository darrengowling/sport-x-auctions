import React, { useState } from 'react';
import { X, Mail, Phone, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import GoogleLoginButton from './GoogleLoginButton';
import FacebookLoginButton from './FacebookLoginButton';
import AppleLoginButton from './AppleLoginButton';
import PhoneAuthModal from './PhoneAuthModal';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [loginType, setLoginType] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  if (!isOpen) return null;

  // Allow users to close modal without authentication
  const handleClose = () => {
    setError('');
    setFormData({ email: '', password: '' });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData, 'email');
    
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    const result = await login({}, 'guest');
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider, userData) => {
    setLoading(true);
    const result = await login(userData, provider);
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle background click to close modal
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackgroundClick}
      >
        <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
            <button 
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Login Methods Tabs */}
          <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setLoginType('email')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                loginType === 'email'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition-all"
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </button>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <GoogleLoginButton 
              onSuccess={(userData) => handleSocialLogin('google', userData)}
              disabled={loading}
            />
            <FacebookLoginButton 
              onSuccess={(userData) => handleSocialLogin('facebook', userData)}
              disabled={loading}
            />
            <AppleLoginButton 
              onSuccess={(userData) => handleSocialLogin('apple', userData)}
              disabled={loading}
            />
          </div>

          {/* Guest Login */}
          <div className="mb-6">
            <Button
              onClick={handleGuestLogin}
              disabled={loading}
              variant="outline"
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <User className="w-4 h-4 mr-2" />
              Continue as Guest
            </Button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <span className="text-slate-600">Don't have an account? </span>
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </div>

          {/* Skip Option */}
          <div className="text-center mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleClose}
              className="text-slate-500 hover:text-slate-700 text-sm"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>

      {/* Phone Auth Modal */}
      {showPhoneModal && (
        <PhoneAuthModal
          isOpen={showPhoneModal}
          onClose={() => setShowPhoneModal(false)}
          onSuccess={() => {
            setShowPhoneModal(false);
            handleClose();
          }}
        />
      )}
    </>
  );
};

export default LoginModal;