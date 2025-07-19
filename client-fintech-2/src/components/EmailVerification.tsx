import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { authAPI } from '../api';
import LoadingSpinner from './LoadingSpinner';

interface EmailVerificationProps {
  onVerificationSent: (email: string) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onVerificationSent, onToast }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  console.log('📧 EmailVerification component rendered');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    console.log('📧 Email input changed:', newEmail);
    setEmail(newEmail);
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📧 Email verification form submitted with email:', email);
    
    if (!email) return;

    console.log('📧 Starting email verification process');
    setIsLoading(true);
    try {
      console.log('📧 Calling register API...');
      await authAPI.register({ email });
      console.log('📧 Register API call successful');
      onToast('OTP sent to your email', 'success');
      console.log('📧 Calling onVerificationSent callback');
      onVerificationSent(email);
    } catch (error:any) {
      console.error('📧 Email verification failed:', error);
      onToast(error.response.data.message || 'Failed to send OTP. Please try again.', 'error');
    } finally {
      console.log('📧 Email verification process completed, setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Budget App</h1>
          <p className="text-gray-600">Budget Management made Seamless</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email which is linked with bank account"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="flex items-start space-x-2 text-sm text-gray-700">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={handleTermsChange}
              className="mt-1"
            />
            <label htmlFor="terms">
              I agree to the <a href="#" className="text-green-600 underline">terms of service</a> and <a href="#" className="text-green-600 underline">privacy policy</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !acceptedTerms}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                Verify My Identity
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;