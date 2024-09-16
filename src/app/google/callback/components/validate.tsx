"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/auth";

export default function Validate() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();

  const { validateGoogleLogin } = useAuth();

  useEffect(() => {
    if (code) {
      validateGoogleLogin({ code: code });
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <main className="w-full py-40 flex justify-center items-center">
      <h2 className="text-tremor-content-boulder950 font-medium text-base">
        Validating...
      </h2>
    </main>
  );
}
