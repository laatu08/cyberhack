export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'bank';
  createdAt: string;
  updatedAt: string;
}


export interface Consent {
  id: string;
  userId: string;
  appId: string;
  dataFields: string[];
  purpose: string;
  expiresAt: string;
  revoked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RevokeRequest {
  id: string;
  consentId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  consent:any;
  user:any;
}

export interface Alert {
  userId: string;
  field: string;
  count: number;
  timestamp: string;
  companyId: string | null;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ProfileResponse {
  user: User;
}

export interface ConsentsResponse {
  consents: Consent[];
}

export interface UsersResponse {
  users: User[];
}

export interface RevokeRequestResponse {
  message: string;
  revokeRequest: RevokeRequest;
}

export interface ProcessRevokeRequest {
  revokeRequestId: string;
  status: 'approved' | 'rejected';
}

export interface ProcessRevokeResponse {
  message: string;
}