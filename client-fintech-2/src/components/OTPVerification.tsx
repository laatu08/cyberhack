import React, { useState } from 'react';
import { Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { authAPI } from '../api';
import LoadingSpinner from './LoadingSpinner';

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onVerified, onBack, onToast }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log('🔐 OTPVerification component rendered with email:', email);

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOtp = e.target.value.replace(/\D/g, '').slice(0, 6);
    console.log('🔐 OTP input changed:', newOtp);
    setOtp(newOtp);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 OTP verification form submitted with OTP:', otp);
    
    if (!otp || otp.length !== 6) return;

    console.log('🔐 Starting OTP verification process');
    setIsLoading(true);
    try {
      console.log('🔐 Calling verifyOTP API...');
      await authAPI.verifyOTP({ email, otp });
      console.log('🔐 VerifyOTP API call successful');
      onToast('Identity verified successfully!', 'success');
      console.log('🔐 Calling onVerified callback');
      onVerified();
    } catch (error) {
      console.error('🔐 OTP verification failed:', error);
      onToast('Invalid OTP. Please try again.', 'error');
    } finally {
      console.log('🔐 OTP verification process completed, setting loading to false');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    console.log('🔐 Back button clicked');
    onBack();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h1>
          <p className="text-gray-600">Enter the 6-digit code sent to</p>
          <p className="text-green-600 font-semibold">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              One-Time Password
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOTPChange}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  Verify
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{' '}
            <button className="text-green-600 hover:text-blue-700 font-semibold">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;