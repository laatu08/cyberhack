import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  console.log('🍞 Toast component rendered:', { message, type, isVisible });

  useEffect(() => {
    if (isVisible) {
      console.log('🍞 Toast auto-close timer started (4s)');
      const timer = setTimeout(() => {
        console.log('🍞 Toast auto-closing');
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) {
    console.log('🍞 Toast not visible, not rendering');
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg transition-all duration-300 ${getBgColor()}`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="text-sm font-medium text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Toast;