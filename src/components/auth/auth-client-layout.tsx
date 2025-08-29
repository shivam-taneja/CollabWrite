"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useIsAuthenticated } from "@/core/auth";

import Loading from "@/components/shared/loading";

export default function AuthClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/feed");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated)
    return <Loading />;

  return (
    <section className="bg-gradient-auth min-h-screen justify-center items-center flex">
      {children}
    </section>
  );
}
