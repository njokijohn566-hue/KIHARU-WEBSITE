import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  setToken: (token: string) => {
    set({ token });
    localStorage.setItem('token', token);
  },
  setUser: (user: any) => set({ user }),
  logout: () => {
    set({ token: null, user: null });
    localStorage.removeItem('token');
  },
  isAuthenticated: () => !!get().token,
}));
