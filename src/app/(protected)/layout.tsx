"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useIsAuthenticated } from "@/core/auth";

import Loading from "@/components/shared/loading";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!isAuthenticated && hasHydrated) {
      router.replace("/feed");
    }
  }, [isAuthenticated, router, hasHydrated]);

  if (!hasHydrated)
    return <Loading />;

  if (!isAuthenticated)
    return <Loading />;

  return (
    <section className="min-h-screen">
      {children}
    </section>
  )
}

export default ProtectedLayout