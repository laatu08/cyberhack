import React from 'react';
import { User, Calendar, Mail, Shield } from 'lucide-react';
import { User as UserType } from '../api/bankService';

interface UserCardProps {
  user: UserType;
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    return role === 'bank' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 
                 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer 
                 transform hover:scale-[1.02] group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {user.name}
            </h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-gray-600 text-sm">
          <Mail className="w-4 h-4 mr-2" />
          <span>{user.email}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Joined {formatDate(user.createdAt)}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <Shield className="w-4 h-4 mr-2" />
          <span>ID: {user.id.slice(0, 8)}...</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;