import React, { useState } from 'react';
import EmailVerification from './components/EmailVerification';
import OTPVerification from './components/OTPVerification';
import Dashboard from './components/Dashboard';
import Toast from './components/Toast';

type AppState = 'email' | 'otp' | 'dashboard';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('email');
  const [userEmail, setUserEmail] = useState('');
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  console.log('🚀 App component rendered with state:', { currentState, userEmail });
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    console.log('🍞 Showing toast:', { message, type });
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    console.log('🍞 Hiding toast');
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleEmailVerification = (email: string) => {
    console.log('📧 Email verification completed, transitioning to OTP state with email:', email);
    setUserEmail(email);
    setCurrentState('otp');
  };

  const handleOTPVerification = () => {
    console.log('🔐 OTP verification completed, transitioning to dashboard state');
    setCurrentState('dashboard');
  };

  const handleBackToEmail = () => {
    console.log('🔙 Going back to email verification state');
    setCurrentState('email');
  };

  const handleLogout = () => {
    console.log('🚪 Logging out, resetting to email state');
    setCurrentState('email');
    setUserEmail('');
  };

  const renderCurrentView = () => {
    console.log('🎨 Rendering view for state:', currentState);
    switch (currentState) {
      case 'email':
        console.log('🎨 Rendering EmailVerification component');
        return (
          <EmailVerification
            onVerificationSent={handleEmailVerification}
            onToast={showToast}
          />
        );
      case 'otp':
        console.log('🎨 Rendering OTPVerification component');
        return (
          <OTPVerification
            email={userEmail}
            onVerified={handleOTPVerification}
            onBack={handleBackToEmail}
            onToast={showToast}
          />
        );
      case 'dashboard':
        console.log('🎨 Rendering Dashboard component');
        return (
          <Dashboard
            email={userEmail}
            onLogout={handleLogout}
            onToast={showToast}
          />
        );
      default:
        console.log('🎨 Unknown state, rendering null');
        return null;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;