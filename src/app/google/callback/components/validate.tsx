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
    <main
      className="w-full h-screen flex justify-center items-center bg-white bg-cover bg-no-repeat"
      style={{ backgroundImage: "url(/line-group.png)" }}
    >
      <div className="login-card scroll-hidden py-14 max-h-[90%] overflow-y-auto large:py-20 tablet:px-5 px-58 flex flex-col items-center w-[510px] large:w-617 tablet:max-w-[calc(100%-24px)] max-w-section h-max rounded-[18.38px] bg-white">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </main>
  );
}
