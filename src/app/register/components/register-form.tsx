"use client";
import LoadingSpinner from "@/components/application/loading-spinner";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { successToast, errorToast } from "@/utils/toast";
import FormInput from "@/components/application/form-input";
import { Mail, Lock, Text } from "lucide-react";

export default function RegisterForm() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/register";

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    // Check for Confirm Password
    if (password !== confirm_password) {
      errorToast("Bad Input", "Password Must Match with Confirm Password");
      return;
    }

    setLoading(true);

    const config: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        secret_key: process.env.NEXT_PUBLIC_SECRET_KEY,
      },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        password_confirmation: confirm_password,
        device_token: crypto.randomUUID(),
      }),
    };

    try {
      const res = await fetch(url, config);
      const data = await res.json();
      if (data[0].success) {
        successToast(
          "Account created successfully",
          "Redirecting You to your Dashboard."
        );
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      errorToast(
        "Failed To create Account",
        error?.response?.data?.message ||
          error.message ||
          "Failed To Create Account"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pt-11 w-full flex flex-col">
      {loading && <LoadingSpinner />}
      <p className="font-bold text-3xl text-[#292929] pb-5">
        Join our Community
      </p>
      <FormInput
        icon={<Text width={17} />}
        type="text"
        onChange={(e) => setFirstName(e.target.value)}
        label="First Name"
        placeholder="First Name"
        value={first_name}
      />
      <FormInput
        icon={<Text width={17} />}
        type="text"
        onChange={(e) => setLastName(e.target.value)}
        label="Last Name"
        placeholder="Last Name"
        value={last_name}
      />
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
      <FormInput
        icon={<Lock width={17} />}
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        label="Confirm Password"
        placeholder="Enter Password"
        value={confirm_password}
      />
      <button
        type="submit"
        className="w-full bg-tremor-background-lightYellow font-semibold text-base text-[#FDFAEF] flex items-center justify-center hover:bg-tremor-background-lightYellow/80 duration-300 h-12 rounded-2xl "
      >
        Sign Up
      </button>
      <div className="w-full pt-4 flex justify-center items-center gap-1">
        <p className="font-normal text-sm text-black/90">
          Already have an account?
        </p>
        <Link
          href="/"
          className="font-normal text-sm text-tremor-background-lightYellow"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}
