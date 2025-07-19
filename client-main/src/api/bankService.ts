import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  message: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  date: string;
  type: 'credit' | 'debit';
  amount: number;
}

export interface UserAccount {
  id: string;
  userId: string;
  accountNo: string;
  balance: number;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

export const bankService = {
  createUser: async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bank/user`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bank/user`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserAccount: async (userId: string): Promise<UserAccount> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bank/user/${userId}/account`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user account:', error);
      throw error;
    }
  },
};