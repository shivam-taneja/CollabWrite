"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useIsAuthenticated } from "@/core/auth";

import Loading from "@/components/shared/loading";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (isAuthenticated && hasHydrated) {
      router.replace("/feed");
    }
  }, [isAuthenticated, router, hasHydrated]);

  if (!hasHydrated)
    return <Loading />;

  if (isAuthenticated)
    return <Loading />;

  return (
    <section className="bg-gradient-auth min-h-screen justify-center items-center flex">
      {children}
    </section>
  )
}

export default AuthLayout