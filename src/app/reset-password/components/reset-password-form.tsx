"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "@/lib/axios";
import { useToast } from "@/contexts/toast";
import Image from "next/image";
import Logo from "@/assets/images/login/logo.svg";
import FormInput from "@/components/application/form-input";
import Link from "next/link";
import Spinner from "@/assets/images/spinner.svg";
import PadLock from "@/assets/images/padlock.svg";
import Cookies from "js-cookie";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isCoutDown, setIsCountDown] = useState(true);
  const { notifyUser }: any = useToast();

  useEffect(() => {
    if (isCoutDown) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);

            // Logic
            setIsCountDown(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isCoutDown]);

  useEffect(() => {
    let userEmail = Cookies.get("userEmail");
    if (userEmail) {
      setEmail(userEmail);
    } else {
      router.push("/forgot-password");
    }
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const resendVerificationCode = () => {
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
    axios
      .request(config)
      .then((response: any) => {
        setLoading(false);
        setTimeLeft(120);
        setIsCountDown(true);
        notifyUser("success", "OTP resent successfully", "right");
      })
      .catch((error: any) => {
        setLoading(false);

        notifyUser(
          "error",
          error?.response?.data?.data?.message || error?.message,
          "right"
        );
      });
  };

  const validateOTP = async () => {
    let config = {
      url: "/check-otp",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { OTP: otp, email },
    };
    try {
      const request = await axios.request(config);
      if (!request.data.success) {
        setLoading(false);
      } else {
        await resetPassword();
      }
    } catch (error: any) {
      setLoading(false);
      notifyUser(
        "error",
        error?.response?.data?.data?.message || error?.message,
        "right"
      );
    }
  };

  const resetPassword = async () => {
    let config = {
      url: "/reset-password",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        secret_key: process.env.NEXT_PUBLIC_SECRET_KEY,
      },
      data: {
        email,
        password,
        password_confirmation: confirm_password,
      },
    };
    try {
      await axios.request(config);
      router.push("/login");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      notifyUser(
        "error",
        error?.response?.data?.data?.message || error?.message,
        "right"
      );
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (password !== confirm_password) {
      notifyUser("error", "Password must match with Confirm Password", "right");
      return;
    }
    try {
      setLoading(true);
      await validateOTP();
    } catch (error: any) {
      notifyUser(
        "error",
        error?.response?.data?.data?.message || error?.message,
        "right"
      );
    }
  };

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
      <h3 className="text-center tablet:text-lg text-22 large:text-28 text-headingText mb-4 large:mb-6 font-semibold">
        Reset Password
      </h3>
      <p className="w-max max-w-full font-normal text-tremor-content-boulder400 large:text-xl text-base text-center mb-6 large:mb-10">
        Enter the otp we just sent to your email. Didn&apos;t receive a code?{" "}
        {isCoutDown ? (
          <>
            you can request for a new code after{" "}
            <span className="font-semibold">
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </>
        ) : (
          <>
            <button
              onClick={resendVerificationCode}
              type="button"
              className="outline-none bg-none border-none font-semibold"
            >
              Request new code
            </button>
          </>
        )}
      </p>
      <div className="w-full  flex flex-col large:gap-7 gap-5">
        <InputOTP
          className="w-full"
          value={otp}
          onChange={(e) => setOtp(e)}
          maxLength={5}
        >
          <InputOTPGroup className="grid w-full lg:w-[500px] large:w-[540px] tablet:w-full max-w-full grid-cols-5 gap-3.5">
            {[0, 1, 2, 3, 4].map((item) => {
              return (
                <InputOTPSlot
                  key={item}
                  className="border min-w-full w-14 lg:w-full lg:h-14 text-[#292929] col-span-1 rounded-[10px] h-12  text-[16px] large:text-[26px] font-bold"
                  index={item}
                />
              );
            })}
          </InputOTPGroup>
        </InputOTP>
        <FormInput
          error={false}
          image={PadLock}
          label="New Password"
          onChange={setPassword}
          value={password}
          placeholder="Enter new password"
          type="password"
        />
        <FormInput
          error={false}
          image={PadLock}
          label="Confirm Password"
          onChange={setConfirmPassword}
          value={confirm_password}
          placeholder="Confirm password"
          type="password"
        />
      </div>

      <div className="px-4 flex flex-col gap-5 tablet:px-2 w-full large:mb-9 mt-5 mb-7 ">
        <button
          type="submit"
          className="w-full bg-tremor-content-asYellow large:h-[60px] h-12 rounded-[20px] flex justify-center items-center text-sm large:text-base font-semibold text-tremor-content-light"
        >
          {!loading && "Change password"}{" "}
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
