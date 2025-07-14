import React, { useState } from 'react';
import { X, Mail, Phone, Eye, EyeOff, User, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import GoogleLoginButton from './GoogleLoginButton';
import FacebookLoginButton from './FacebookLoginButton';
import AppleLoginButton from './AppleLoginButton';
import PhoneAuthModal from './PhoneAuthModal';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [registerType, setRegisterType] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    favoriteTeam: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  if (!isOpen) return null;

  // Allow users to close modal without registration
  const handleClose = () => {
    setError('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      favoriteTeam: '',
      agreeToTerms: false
    });
    onClose();
  };

  // Handle background click to close modal
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      favoriteTeam: formData.favoriteTeam
    };

    const result = await register(userData, 'email');
    
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider, userData) => {
    setLoading(true);
    // For social registration, we still use the login function
    // The backend will create account if user doesn't exist
    const { login } = useAuth();
    const result = await login(userData, provider);
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const teams = ['RCB', 'MI', 'CSK', 'KKR', 'DC', 'PBKS', 'RR', 'SRH', 'GT', 'LSG'];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackgroundClick}
      >
        <div className="bg-white rounded-2xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
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

          {/* Register Methods Tabs */}
          <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setRegisterType('email')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                registerType === 'email'
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

          {/* Email Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <select
              name="favoriteTeam"
              value={formData.favoriteTeam}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select favorite team (optional)</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>

            <div className="flex items-start space-x-3">
              <div className="relative">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div 
                  onClick={() => setFormData({...formData, agreeToTerms: !formData.agreeToTerms})}
                  className={`w-5 h-5 rounded border-2 cursor-pointer transition-all ${
                    formData.agreeToTerms 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-slate-300 hover:border-blue-400'
                  }`}
                >
                  {formData.agreeToTerms && (
                    <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <label className="text-sm text-slate-600 cursor-pointer">
                I agree to the{' '}
                <span className="text-blue-600 hover:text-blue-700">Terms of Service</span>
                {' '}and{' '}
                <span className="text-blue-600 hover:text-blue-700">Privacy Policy</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Or sign up with</span>
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

          {/* Login Link */}
          <div className="text-center">
            <span className="text-slate-600">Already have an account? </span>
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
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
            onClose();
          }}
          isRegistration={true}
        />
      )}
    </>
  );
};

export default RegisterModal;