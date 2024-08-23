"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAppAuth } from "@/hooks/app-auth";

export default function Page() {
  const app = Cookies.get("app");
  const token = Cookies.get("token");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { login } = useAppAuth();

  useEffect(() => {
    if (!token || !app) {
      router.push("/");
    } else {
      login({ app, setLoading });
    }
  }, []);

  return <main></main>;
}
