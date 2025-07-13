import React, { useState, useEffect } from 'react';
import { X, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const PhoneAuthModal = ({ isOpen, onClose, onSuccess, isRegistration = false }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'verification'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState({
    firstName: '',
    lastName: '',
    favoriteTeam: ''
  });

  const { sendPhoneVerification, verifyPhoneCode, login, register } = useAuth();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendCode = async () => {
    setLoading(true);
    setError('');

    // Basic phone number validation
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    const result = await sendPhoneVerification(phoneNumber);
    
    if (result.success) {
      setStep('verification');
      setCountdown(60); // 60 second countdown
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');

    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      setLoading(false);
      return;
    }

    const verifyResult = await verifyPhoneCode(phoneNumber, verificationCode);
    
    if (verifyResult.success) {
      // If this is registration and we need additional info
      if (isRegistration && (!additionalInfo.firstName || !additionalInfo.lastName)) {
        setStep('additionalInfo');
        setLoading(false);
        return;
      }

      // Complete authentication
      const authData = {
        phoneNumber,
        verificationCode,
        ...additionalInfo
      };

      const authResult = isRegistration 
        ? await register(authData, 'phone')
        : await login(authData, 'phone');

      if (authResult.success) {
        onSuccess();
      } else {
        setError(authResult.error);
      }
    } else {
      setError(verifyResult.error);
    }
    setLoading(false);
  };

  const handleCompleteRegistration = async () => {
    setLoading(true);
    setError('');

    if (!additionalInfo.firstName || !additionalInfo.lastName) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const authData = {
      phoneNumber,
      verificationCode,
      ...additionalInfo
    };

    const result = await register(authData, 'phone');
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const teams = ['RCB', 'MI', 'CSK', 'KKR', 'DC', 'PBKS', 'RR', 'SRH', 'GT', 'LSG'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            {step !== 'phone' && (
              <button 
                onClick={() => setStep(step === 'additionalInfo' ? 'verification' : 'phone')}
                className="text-slate-400 hover:text-slate-600 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-2xl font-bold text-slate-900">
              {step === 'phone' && 'Phone Number'}
              {step === 'verification' && 'Verification Code'}
              {step === 'additionalInfo' && 'Complete Profile'}
            </h2>
          </div>
          <button 
            onClick={onClose}
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

        {/* Phone Number Step */}
        {step === 'phone' && (
          <div className="space-y-4">
            <p className="text-slate-600 mb-4">
              We'll send you a verification code to confirm your phone number.
            </p>
            
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="tel"
                placeholder="(555) 123-4567"
                value={formatPhoneNumber(phoneNumber)}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10"
                maxLength={14}
              />
            </div>

            <Button
              onClick={handleSendCode}
              disabled={loading || phoneNumber.replace(/\D/g, '').length < 10}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </div>
        )}

        {/* Verification Code Step */}
        {step === 'verification' && (
          <div className="space-y-4">
            <p className="text-slate-600 mb-4">
              Enter the 6-digit code sent to {formatPhoneNumber(phoneNumber)}
            </p>
            
            <Input
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />

            <Button
              onClick={handleVerifyCode}
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-slate-500">Resend code in {countdown}s</p>
              ) : (
                <button
                  onClick={handleSendCode}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Resend verification code
                </button>
              )}
            </div>
          </div>
        )}

        {/* Additional Info Step (for registration) */}
        {step === 'additionalInfo' && (
          <div className="space-y-4">
            <p className="text-slate-600 mb-4">
              Just a few more details to complete your account.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="First name"
                value={additionalInfo.firstName}
                onChange={(e) => setAdditionalInfo({
                  ...additionalInfo,
                  firstName: e.target.value
                })}
                required
              />
              <Input
                type="text"
                placeholder="Last name"
                value={additionalInfo.lastName}
                onChange={(e) => setAdditionalInfo({
                  ...additionalInfo,
                  lastName: e.target.value
                })}
                required
              />
            </div>

            <select
              value={additionalInfo.favoriteTeam}
              onChange={(e) => setAdditionalInfo({
                ...additionalInfo,
                favoriteTeam: e.target.value
              })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select favorite team (optional)</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>

            <Button
              onClick={handleCompleteRegistration}
              disabled={loading || !additionalInfo.firstName || !additionalInfo.lastName}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneAuthModal;