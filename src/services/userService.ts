import { api, setAccessToken } from './api';

export interface AuthResponse {
  message: string;
  userId: string;
  accessToken: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export const userService = {
  /**
   * Register a new account
   */
  async register(credentials: RegisterDTO): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    setAccessToken(response.data.accessToken);
    return response.data;
  },

  /**
   * Log into existing account
   */
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    setAccessToken(response.data.accessToken);
    return response.data;
  },

  /**
   * Explicitly logout and clear session
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  /**
   * Manual token refresh check (useful on app initialize/reload)
   */
  async checkAuthStatus(): Promise<string> {
    const response = await api.post<{ accessToken: string }>('/auth/refresh-token');
    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  },
};