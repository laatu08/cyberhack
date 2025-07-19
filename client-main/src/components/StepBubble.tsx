import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StepBubbleProps {
  step: number;
  title: string;
  description: string;
  onClick?: () => void;
  isClickable?: boolean;
  className?: string;
}

const StepBubble: React.FC<StepBubbleProps> = ({
  step,
  title,
  description,
  onClick,
  isClickable = false,
  className = ''
}) => {
  return (
    <div
      className={`
        relative rounded-2xl p-8 transition-all duration-300 transform hover:scale-105
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
        {step}
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        
        {isClickable && (
          <div className="flex items-center mt-4 text-blue-600 group">
            <span className="text-sm font-medium">Get Started</span>
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StepBubble;