import { create } from 'zustand';

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  logout: () => set({ accessToken: null }),
  refreshAccessToken: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BE_API}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      set({ accessToken: null });
      throw new Error('Failed to refresh token');
    }
    const data = await response.json();
    if (data.code === 'success') {
      set({ accessToken: data.data.accessToken });
    } else {
      set({ accessToken: null });
      throw new Error(data.message || 'Failed to refresh token');
    }
  },
}));
