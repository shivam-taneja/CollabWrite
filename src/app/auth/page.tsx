"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Loading from "@/components/shared/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";

const OauthFallback = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      setError(err);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {decodeURIComponent(error)}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <Loading />;
};

export default OauthFallback;
