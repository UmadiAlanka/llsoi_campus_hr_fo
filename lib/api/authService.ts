// lib/api/authService.ts
import apiClient from './apiClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  role?: string; // ADMIN, HR, EMPLOYEE
  userId?: number;
  username?: string;
  name?: string;
}

export const authService = {
  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      // Store user data in localStorage if login successful
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return response.data || response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

 
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if API call fails
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: (): LoginResponse | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  /**
   * Get user role
   */
  getUserRole: (): string | null => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },
};

export default authService;