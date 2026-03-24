import { create } from 'zustand';
import api from '@/lib/axios';

interface AdminState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (email: string, token: string) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify({ email }));
    set({ user: { email }, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr), isAuthenticated: true });
    }
  }
}));
