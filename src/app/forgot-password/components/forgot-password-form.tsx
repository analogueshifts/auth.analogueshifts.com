"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/assets/images/login/logo.svg";
import Envelope from "@/assets/images/envelope.svg";
import FormInput from "@/components/application/form-input";
import Spinner from "@/assets/images/spinner.svg";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { useToast } from "@/contexts/toast";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { notifyUser }: any = useToast();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    let data = JSON.stringify({
      email: email,
    });

    let config = {
      method: "POST",
      url: "/forgot-password",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    setLoading(true);

    // Send a new Verification Code to user, and navigate to the reset password page
    axios
      .request(config)
      .then((res) => {
        setLoading(false);

        if (res?.data?.success) {
          Cookies.set("userEmail", email);
          router.push("/reset-password");
        }
      })
      .catch((error: any) => {
        setLoading(false);
        // Toast Error
        notifyUser(
          "error",
          error?.response?.data?.message || error?.message,
          "right"
        );
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
        Forgotten Password
      </h3>
      <div className="w-full  flex flex-col large:gap-7 gap-5">
        <FormInput
          error={emailError}
          image={Envelope}
          label="Email"
          onChange={setEmail}
          value={email}
          placeholder="Enter email"
          type="email"
        />
      </div>

      <div className="px-4 flex flex-col gap-5 tablet:px-2 w-full large:mb-9 mt-5 mb-7 ">
        <button
          type="submit"
          className="w-full bg-tremor-content-asYellow large:h-[60px] h-12 rounded-[20px] flex justify-center items-center text-sm large:text-base font-semibold text-tremor-content-light"
        >
          {!loading && "Send password reset otp"}{" "}
          <Image
            src={Spinner}
            alt=""
            className={`animate-spin ${loading ? "flex" : "hidden"}`}
          />
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
