"use client";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useRouter } from "next/navigation";

export default function Redirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  let app = searchParams.get("app");

  const navigate = () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    } else {
      router.push("/app-login");
    }
  };
  useEffect(() => {
    if (app) {
      Cookies.set("app", app);
      navigate();
    } else {
      Cookies.set("app", "main");
      navigate();
    }
  }, []);
  return <main></main>;
}
