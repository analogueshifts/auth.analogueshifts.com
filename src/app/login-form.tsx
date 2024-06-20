"use client";
import LoadingSpinner from "@/components/application/loading-spinner";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { successToast, errorToast } from "@/utils/toast";
import FormInput from "@/components/application/form-input";
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/";

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);

    const config: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        secret_key: process.env.NEXT_PUBLIC_SECRET_KEY,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        device_token: crypto.randomUUID(),
      }),
    };

    try {
      const res = await fetch(url, config);
      const data = await res.json();
      if (data.success) {
        successToast("Login Successful", "Redirecting You to your Dashboard.");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      errorToast(
        "Failed To Login",
        error?.response?.data?.message || error.message || "Failed To Login"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pt-11 w-full flex flex-col">
      {loading && <LoadingSpinner />}
      <p className="font-medium text-lg text-tremor-content-grayText pb-4">
        Welcome!
      </p>
      <p className="font-bold text-3xl text-[#292929] pb-5">
        Sign Into Your Account
      </p>

      <FormInput
        icon={<Mail width={17} />}
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        placeholder="Enter Email"
        value={email}
      />

      <FormInput
        icon={<Lock width={17} />}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
        placeholder="Enter Password"
        value={password}
      />
      <button
        type="submit"
        className="w-full bg-tremor-background-lightYellow font-semibold text-base text-[#FDFAEF] flex items-center justify-center hover:bg-tremor-background-lightYellow/80 duration-300 h-12 rounded-2xl "
      >
        Login
      </button>
      <div className="w-full pt-4 flex justify-center items-center gap-1">
        <Link
          href="/forgot-password"
          className="font-normal cursor-pointer text-sm text-black/90"
        >
          Forgotten Password?
        </Link>
      </div>
      <div className="w-full pt-2 flex justify-center items-center gap-1">
        <p className="font-normal text-sm text-black/90">
          Don&apos;t have an account?
        </p>
        <Link
          href="/register"
          className="font-normal text-sm text-tremor-background-lightYellow"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
}
