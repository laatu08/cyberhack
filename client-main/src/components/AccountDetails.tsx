import React from 'react';
import { ArrowLeft, CreditCard, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { UserAccount, Transaction } from '../api/bankService';

interface AccountDetailsProps {
  account: UserAccount;
  onBack: () => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ account, onBack }) => {
  const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type: 'credit' | 'debit') => {
    return type === 'credit' ? (
      <TrendingUp className="w-5 h-5 text-green-500" />
    ) : (
      <TrendingDown className="w-5 h-5 text-red-500" />
    );
  };

  const getTransactionColor = (type: 'credit' | 'debit') => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Users
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Account Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Account Details</h2>
              <div className="flex items-center space-x-2 text-blue-100">
                <CreditCard className="w-5 h-5" />
                <span className="text-lg">{account.accountNo}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm mb-1">Current Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(account.balance)}</p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="p-8 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Account ID</p>
              <p className="font-semibold">{account.id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Created Date</p>
              <p className="font-semibold">{formatDate(account.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Last Updated</p>
              <p className="font-semibold">{formatDate(account.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Transaction History
          </h3>
          
          {account.transactions.length > 0 ? (
            <div className="space-y-4">
              {account.transactions.map((transaction: Transaction, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {transaction.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;