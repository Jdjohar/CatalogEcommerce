import { create } from 'zustand';
import api from '@/lib/axios';

interface SiteSettings {
  aboutUs?: string;
  logo?: { url: string; public_id: string };
  whatsappNumber?: string;
  whatsappMessage?: string;
  inquiryEmail?: string;
  emailMessage?: string;
  openaiApiKey?: string;
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

interface SettingsState {
  settings: SiteSettings | null;
  loading: boolean;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: true,
  fetchSettings: async () => {
    try {
      const res = await api.get('/settings');
      set({ settings: res.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch settings', error);
      set({ loading: false });
    }
  }
}));
