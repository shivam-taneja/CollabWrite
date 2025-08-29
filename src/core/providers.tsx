'use client';

import { usePathname } from 'next/navigation';

import React from 'react';

import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/auth/login' || pathname === '/auth/signup';

  return (
    <>
      {!isAuthRoute && <Header />}
      {children}
      {!isAuthRoute && <Footer />}
    </>
  )
}

export default Providers