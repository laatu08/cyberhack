import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, X, ChevronDown, ChevronUp } from 'lucide-react';
import StepBubble from '../components/StepBubble';

interface FAQItem {
  question: string;
  answer: string;
}

const VaultLanding: React.FC = () => {
  const navigate = useNavigate();
  const [showFintechModal, setShowFintechModal] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleFintechRedirect = (app: 'zpay' | 'budget') => {
    const url = app === 'zpay' ? 'http://localhost:3001' : 'http://localhost:3005';
    window.open(url, '_blank');
    setShowFintechModal(false);
  };

  const handleVaultDashboard = () => {
    window.open('http://localhost:3000', '_blank');
  };

  const handleStep2Click = () => {
    setShowFintechModal(true);
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData: FAQItem[] = [
    {
      question: "How secure is my banking data with Vault?",
      answer: "Vault uses bank-grade end-to-end encryption and zero-knowledge architecture. Your data is tokenized and encrypted before transmission, ensuring that even we cannot access your sensitive information."
    },
    {
      question: "Can I revoke access to my data at any time?",
      answer: "Absolutely! You have complete control over your data. You can request to revoke access to any fintech application through your Vault dashboard. The revocation request is sent to your bank for processing, which ensures reliability and prevents accidental data termination."
    },
    {
      question: "What happens if I detect suspicious activity?",
      answer: "Vault's monitoring system alerts you of any anomalous behavior based on predefined rules for data access. You'll receive real-time notifications that are visible to both you and your bank, helping you stay informed about your data usage patterns."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="container mx-auto px-6 pt-16 pb-12">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mr-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Vault
            </h1>
          </div>
          {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
        A secure platform for sharing your financial data with trusted fintech applications.
          </p> */}
          {/* <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div> */}
        </div>

        {/* Steps Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">
            How It Works
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto text-lg">
             create a bank account , grant data consent to fintech application and get started with vault services.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepBubble
              step={1}
              title="Connect Your Bank"
              description="Securely link your bank account through our encrypted connection. Create your profile and verify your identity with bank-grade security protocols."
              onClick={() => navigate('/bank-service')}
              isClickable={true}
              className="bg-white border-2 border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-xl"
            />

            <StepBubble
              step={2}
              title="Choose Fintech Partner"
              description="Select from our verified fintech partners. Grant specific permissions and control exactly what data you want to share with each application."
              onClick={handleStep2Click}
              isClickable={true}
              className="bg-white border-2 border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-xl"
            />

            <StepBubble
              step={3}
              title="Monitor & Control"
              description="Access your comprehensive dashboard to monitor data usage, receive alerts, manage permissions, and revoke access instantly whenever needed."
              onClick={handleVaultDashboard}
              isClickable={true}
              className="bg-white border-2 border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-xl"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-semibold text-gray-900 pr-4">{faq.question}</h4>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fintech Selection Modal */}
      {showFintechModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setShowFintechModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Choose Your Fintech Partner
            </h3>
            <p className="text-gray-600 text-center mb-8">
              Select a trusted fintech application to securely share your data with
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => handleFintechRedirect('zpay')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                         text-white rounded-xl p-6 transition-all duration-300 transform hover:scale-105 
                         shadow-lg hover:shadow-xl group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-xl font-semibold mb-2">Z-Pay</h4>
                    <p className="text-blue-100">Fast and secure payment processing</p>
                  </div>
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              <button
                onClick={() => handleFintechRedirect('budget')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
                         text-white rounded-xl p-6 transition-all duration-300 transform hover:scale-105 
                         shadow-lg hover:shadow-xl group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-xl font-semibold mb-2">Budget App</h4>
                    <p className="text-green-100">Smart financial planning and insights</p>
                  </div>
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultLanding;