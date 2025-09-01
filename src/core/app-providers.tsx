'use client';

import { usePathname } from 'next/navigation';

import React, { Suspense, useEffect } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { account } from '@/lib/appwrite-client';
import { useAuthActions } from './auth';

import NextTopLoader from 'nextjs-toploader';

import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import Loading from '@/components/shared/loading';
import { ToastContainer } from 'react-toastify';

const authRoutes = ['/auth/login', '/auth/signup'];

export const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.includes(pathname);
  const { setUser, logout } = useAuthActions()

  useEffect(() => {
    (async () => {
      try {
        const user = await account.get();
        setUser({
          $id: user.$id,
          name: user.name,
          email: user.email,
        });
      } catch {
        logout()
      }
    })();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <QueryClientProvider client={queryClient}>
        <NextTopLoader
          color='#000080'
          height={4}
        />
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
          className="p-4 sm:p-0"
        />
        {!isAuthRoute && <Header />}
        {children}
        {!isAuthRoute && <Footer />}
      </QueryClientProvider>
    </Suspense>
  )
}

export default AppProviders