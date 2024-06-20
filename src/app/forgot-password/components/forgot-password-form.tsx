"use client";
import LoadingSpinner from "@/components/application/loading-spinner";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { errorToast } from "@/utils/toast";
import FormInput from "@/components/application/form-input";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/forgot-password";

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const axios = require("axios");
    let data = JSON.stringify({
      email: email,
    });

    let config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    setLoading(true);

    // Send a new Verification Code to user, and navigate to the reset password page
    axios
      .request(config)
      .then(() => {
        setLoading(false);
        router.push("/reset-password");
      })
      .catch((error: any) => {
        setLoading(false);
        errorToast(
          "An Error Occured, Please try again later",
          error?.response?.data?.message || error.message || ""
        );
      });
  }

  return (
    <form onSubmit={handleSubmit} className="pt-11 w-full flex flex-col">
      {loading && <LoadingSpinner />}

      <p className="font-medium text-lg text-tremor-content-grayText pb-4">
        Forgot your Password?
      </p>
      <p className="font-bold text-3xl text-[#292929] pb-5">
        Enter your email address
      </p>
      <FormInput
        icon={<Mail width={17} />}
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        placeholder="Enter Email"
        value={email}
      />

      <button
        type="submit"
        className="w-full bg-tremor-background-lightYellow font-semibold text-base text-[#FDFAEF] flex items-center justify-center hover:bg-tremor-background-lightYellow/80 duration-300 h-12 rounded-2xl "
      >
        Submit
      </button>

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
