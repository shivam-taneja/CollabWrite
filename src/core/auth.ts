import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import CryptoJS from 'crypto-js';

import { account } from '@/lib/appwrite-client';
import { AuthState } from '@/types/auth';

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || "fallback-secret";

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      jwt: null,
      jwtExpiry: null,

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
            jwt: null,
            jwtExpiry: null
          }),

        getValidJwt: async () => {
          const { jwt, jwtExpiry } = get();
          const now = Date.now();

          if (jwt && jwtExpiry && now < jwtExpiry) {
            return jwt;
          }

          const res = await account.createJWT();

          // setting expiry to be 15 mins
          const expiry = now + 15 * 60 * 1000;

          set({ jwt: res.jwt, jwtExpiry: expiry });

          return res.jwt;
        },

        getJwtIfValid: () => {
          const { jwt, jwtExpiry } = get();
          const now = Date.now();

          return jwt && jwtExpiry && now < jwtExpiry ? jwt : null;
        },
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        jwt: state.jwt,
        jwtExpiry: state.jwtExpiry,
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