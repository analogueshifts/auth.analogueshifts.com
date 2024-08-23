"use client";
import { useAuth } from "@/hooks/auth";
import { useToast } from "@/contexts/toast";
import { useState, FormEvent, useEffect } from "react";

import Link from "next/link";
import FormInput from "@/components/application/form-input";
import UserImage from "@/assets/images/user.svg";
import Spinner from "@/assets/images/spinner.svg";
import Envelope from "@/assets/images/envelope.svg";
import PadLock from "@/assets/images/padlock.svg";
import Briefcase from "@/assets/images/grid-two-layout/briefcase.svg";
import Hire from "@/assets/images/grid-two-layout/hire.svg";
import Image from "next/image";

export default function RegisterForm() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("job");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const { notifyUser }: any = useToast();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    // Check for Confirm Password
    if (password !== confirm_password) {
      notifyUser("Bad error", "Password Must Match with Confirm Password");
      setError((prev) => {
        return { ...prev, password: true, confirmPassword: true };
      });
      return;
    }

    register({
      setLoading,
      data: {
        first_name,
        last_name,
        email,
        password,
        password_confirmation: confirm_password,
        device_token: crypto.randomUUID(),
        user_mode: accountType,
      },
    });
  }

  useEffect(() => {
    if (password === confirm_password) {
      setError((prev) => {
        return { ...prev, password: false, confirmPassword: false };
      });
    }
  }, [password, confirm_password]);

  const validateFields = () => {
    return [first_name, last_name, email, password, confirm_password].includes(
      ""
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full pb-10 overflow-y-auto flex flex-col items-center px-6 large:pt-[112px] pt-[56px]"
    >
      <h2 className="w-max text-center text-black font-semibold large:text-32 text-2xl mb-2">
        Sign Up
      </h2>
      <p className="w-max font-normal text-tremor-content-boulder400 large:text-xl text-base text-center flex justify-center h-max large:mb-12 mb-9">
        Already have an account?&nbsp;{" "}
        <Link href="/login" className="text-tremor-content-asYellow">
          Login
        </Link>
      </p>
      <div className="w-[500px] large:mb-8 mb-6 max-w-full flex flex-wrap gap-x-5 gap-y-[27px]">
        <div className="w-[calc(50%-10px)]">
          <FormInput
            image={UserImage}
            label="First Name"
            placeholder="First Name"
            value={first_name}
            onChange={setFirstName}
            type="text"
            error={error.firstName}
          />
        </div>
        <div className="w-[calc(50%-10px)]">
          <FormInput
            image={UserImage}
            label="Last Name"
            placeholder="Last Name"
            value={last_name}
            onChange={setLastName}
            type="text"
            error={error.lastName}
          />
        </div>
        <FormInput
          image={Envelope}
          label="Email"
          placeholder="your email address"
          value={email}
          onChange={setEmail}
          type="email"
          error={error.email}
        />{" "}
        <FormInput
          image={PadLock}
          label="Password"
          placeholder="input password"
          value={password}
          onChange={setPassword}
          type="password"
          error={error.password}
        />
        <FormInput
          image={PadLock}
          label="Confirm Password"
          placeholder="input password"
          value={confirm_password}
          onChange={setConfirmPassword}
          type="password"
          error={error.confirmPassword}
        />
      </div>
      <div className="w-[500px]  max-w-full flex flex-col gap-3 large:gap-4">
        <p className="large:text-base text-sm font-normal text-tremor-content-grayText">
          Account Type
        </p>
        <div className="w-full grid grid-cols-2 gap-6 mb-7 large:mb-10">
          {["job", "hire"].map((item: string) => {
            return (
              <button
                key={item}
                onClick={() => setAccountType(item)}
                type="button"
                className={`col-span-1 h-40 flex flex-col items-center justify-center gap-2.5 large:h-[196px] rounded-2xl border ${
                  accountType === item
                    ? "border-tremor-content-asYellow"
                    : "border-tremor-border-boulder200"
                }`}
              >
                <Image src={item === "job" ? Briefcase : Hire} alt="" />
                <p
                  className={`large:text-base text-sm font-normal ${
                    accountType === item
                      ? "text-tremor-content-asYellow"
                      : "text-tremor-content-grayText"
                  }`}
                >
                  {item === "job" ? "Job Seeker" : "Recruiter"}
                </p>
              </button>
            );
          })}
        </div>
        <button
          type="submit"
          disabled={validateFields()}
          className={`w-full bg-tremor-content-asYellow large:h-[60px] h-12 rounded-[20px] flex justify-center items-center text-sm large:text-base font-semibold text-tremor-content-light ${
            validateFields() ? "opacity-50" : "opacity-100"
          }`}
        >
          {!loading && "Create Account!"}{" "}
          <Image
            src={Spinner}
            alt=""
            className={`animate-spin ${loading ? "flex" : "hidden"}`}
          />
        </button>
      </div>
    </form>
  );
}
