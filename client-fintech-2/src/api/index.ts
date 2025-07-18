import axios from 'axios';

const API_BASE_URL = 'http://localhost:3004/fintech';

console.log('API Base URL:', API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);
export interface RegisterRequest {
  email: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
}

export interface DataRequest {
  email: string;
  fields: string[];
}

export interface DataResponse {
  data: Record<string, string>;
}

export const authAPI = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    console.log('📧 Calling register API with data:', data);
    const response = await api.post('/register', data);
    console.log('📧 Register API response:', response.data);
    return response.data;
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    console.log('🔐 Calling verifyOTP API with data:', data);
    const response = await api.post('/verify-otp', data);
    console.log('🔐 VerifyOTP API response:', response.data);
    return response.data;
  },

  getData: async (data: DataRequest): Promise<DataResponse> => {
    console.log('📊 Calling getData API with data:', data);
    const response = await api.post('/data', data);
    console.log('📊 GetData API response:', response.data);
    return response.data;
  },
};