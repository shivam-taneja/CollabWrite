"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { useIsAuthenticated } from "@/core/auth";

import Loading from "@/components/shared/loading";

type ProtectedWrapperProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

const ProtectedWrapper = ({ children, redirectTo = "/feed" }: ProtectedWrapperProps) => {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && hydrated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, hydrated, router, redirectTo]);

  if (!hydrated) return <Loading />;
  if (!isAuthenticated) return <Loading />;

  return <>{children}</>;
};

export default ProtectedWrapper;
