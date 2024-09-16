"use client";
import { useAuth } from "@/hooks/auth";
import { useState, FormEvent, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/login/logo.svg";
import Envelope from "@/assets/images/envelope.svg";
import PadLock from "@/assets/images/padlock.svg";
import Spinner from "@/assets/images/spinner.svg";
import Google from "@/assets/images/google.svg";

import FormInput from "@/components/application/form-input";
import CustomCheckBox from "@/components/application/custom-checkbox";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Errors
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const { login, generateGoogleAuthLink } = useAuth();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setErrors({ email: false, password: false });
    setLoading(true);

    login({
      email,
      password,
      setLoading,
      handleBadCredentials: () => {
        setErrors({ email: true, password: true });
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="login-card scroll-hidden py-10 max-h-[90%] overflow-y-auto large:py-14 tablet:px-5 px-58 flex flex-col items-center w-[510px] large:w-617 tablet:max-w-[calc(100%-24px)] max-w-section h-max rounded-[18.38px] bg-white"
    >
      <Image
        src={Logo}
        alt="Logo Image"
        className="large:mb-10 mb-6 large:w-max h-max tablet:w-9 w-10"
      />
      <h3 className="text-center tablet:text-lg text-22 large:text-28 text-headingText mb-6 large:mb-10 font-semibold">
        Log in to your Account
      </h3>
      <div className="w-full  flex flex-col large:gap-7 gap-5">
        <FormInput
          error={errors.email}
          image={Envelope}
          label="Email"
          onChange={setEmail}
          value={email}
          placeholder="analogueshifts@gmail.com"
          type="email"
        />
        <FormInput
          error={errors.password}
          image={PadLock}
          label="Password"
          onChange={setPassword}
          value={password}
          placeholder="Analogue"
          type="password"
        />
      </div>
      <div className="w-full large:mb-9 mb-7 flex tablet:px-2 flex-wrap px-4 justify-between items-center large:mt-6 mt-4">
        <div
          className="w-max flex items-center tablet:gap-2 gap-3 cursor-default"
          onClick={() => setRememberMe((prev) => !prev)}
        >
          <CustomCheckBox checked={rememberMe} />
          <p className="text-headingText font-medium tablet:text-[13px] text-[15px] large:text-lg">
            Remember me
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="text-tremor-content-asYellow font-medium tablet:text-[13px] text-[15px] large:text-lg"
        >
          Forgot Password?
        </Link>
      </div>
      <div className="px-4 flex flex-col gap-3 tablet:px-2 w-full large:mb-9 mb-7 ">
        <button
          type="submit"
          className="w-full bg-tremor-content-asYellow large:h-[60px] h-12 rounded-[20px] flex justify-center items-center text-sm large:text-base font-semibold text-tremor-content-light"
        >
          {!loading && "Login"}{" "}
          <Image
            src={Spinner}
            alt=""
            className={`animate-spin ${loading ? "flex" : "hidden"}`}
          />
        </button>
        <button
          onClick={generateGoogleAuthLink}
          type="button"
          className="w-full large:h-[60px] h-12  rounded-[20px] gap-2.5 text-tremor-content-boulder950 text-sm large:text-base font-semibold flex justify-center items-center border border-[#9D9D9D] bg-[#FEF8F7]"
        >
          <Image src={Google} className="w-max h-max " alt="Google" /> Sign in
          with Google
        </button>
      </div>
      <p className="flex items-center tablet:text-[13px] justify-center font-medium text-[15px] large:text-lg text-headingText">
        New to AnalogueShifts?&nbsp;
        <Link href="/register" className="text-tremor-content-asYellow">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
