import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Users, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { bankService, CreateUserRequest, User, UserAccount } from '../api/bankService';
import UserCard from '../components/UserCard';
import AccountDetails from '../components/AccountDetails';

const BankService: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'create' | 'users'>('create');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await bankService.getAllUsers();
      setUsers(userData);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await bankService.createUser(formData);
      setSuccess(`User created successfully! User ID: ${response.userId}`);
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const account = await bankService.getUserAccount(userId);
      setSelectedAccount(account);
    } catch (err) {
      setError('Failed to fetch user account details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (selectedAccount) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-6">
        <div className="container mx-auto">
          <AccountDetails
            account={selectedAccount}
            onBack={() => setSelectedAccount(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vault
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Service Portal</h1>
          <p className="text-gray-600">Manage bank accounts and user information</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('create');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <UserPlus className="w-5 h-5 inline-block mr-2" />
              Create Bank Account
            </button>
            <button
              onClick={() => {
                setActiveTab('users');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5 inline-block mr-2" />
              All Users ({users.length})
            </button>
          </div>

          <div className="p-8">
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-green-700">{success}</span>
              </div>
            )}

            {/* Create User Tab */}
            {activeTab === 'create' && (
              <div className="max-w-lg mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Your Bank Account</h3>
                    <p className="text-gray-600">Join our secure banking platform today</p>
                  </div>
                
                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">
                      Full Name
                    </label>
                    <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-900 placeholder-gray-400"
                      placeholder="Enter your full name"
                      required
                    />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-900 placeholder-gray-400"
                      placeholder="Enter your email address"
                      required
                    />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-3">
                      Password
                    </label>
                    <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-900 placeholder-gray-400"
                      placeholder="Create a secure password"
                      required
                    />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        <span>Create Bank Account</span>
                      </>
                    )}
                  </button>
                </form>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                {loading && !selectedAccount ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">Loading users...</span>
                  </div>
                ) : users.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onClick={() => handleUserClick(user.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-600">Create your first bank account to get started.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankService;