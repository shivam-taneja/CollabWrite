'use client';

import { usePathname } from 'next/navigation';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { ToastContainer } from 'react-toastify';

const authRoutes = ['/auth/login', '/auth/signup'];

export const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.includes(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          background: 'var(--gradient-primary)',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '12px',
        }}
      />
      {!isAuthRoute && <Header />}
      {children}
      {!isAuthRoute && <Footer />}
    </QueryClientProvider>
  )
}

export default AppProviders