import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { authUtils } from '../utils/auth';
import { toast } from '../utils/toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const user = authUtils.getCurrentUser();

  const handleLogout = async () => {
    console.log('🔄 Layout - Logout initiated');
    try {
      authUtils.logout();
      console.log('✅ Layout - Auth cleared successfully');
      toast.success('Logged out successfully');
      console.log('🔄 Layout - Navigating to login page');
      navigate('/login');
      console.log('✅ Layout - Navigation completed');
    } catch (error) {
      console.error('❌ Layout - Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  // Don't render layout if user is null (during logout transition)
  if (!user) {
    console.log('🔄 Layout - User is null, not rendering layout');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Vault System</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-gray-500 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};