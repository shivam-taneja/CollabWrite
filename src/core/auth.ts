import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import CryptoJS from 'crypto-js';

import { AuthState } from '@/types/auth';

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || "fallback-secret";

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      actions: {
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
          }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
          }),
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      storage: {
        getItem: (name) => {
          const encrypted = localStorage.getItem(name);
          if (!encrypted)
            return null;

          try {
            const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decrypted);
          } catch (e) {
            console.error("Decryption error: ", e);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), SECRET_KEY).toString();

            localStorage.setItem(name, encrypted);
          } catch (e) {
            console.error("Encryption error: ", e);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

export const useUserDetails = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)

export const useAuthActions = () => useAuthStore((state) => state.actions);