import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  loadAuth: () => void;
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

  setUser: (user: any) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },

  loadAuth: () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token) {
      set({
        token,
        user: storedUser ? JSON.parse(storedUser) : null,
      });
    }
  },

  logout: () => {
    set({
      token: null,
      user: null,
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => !!get().token,
}));