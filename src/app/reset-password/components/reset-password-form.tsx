"use client";
import LoadingSpinner from "@/components/application/loading-spinner";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { errorToast, successToast } from "@/utils/toast";
import FormInput from "@/components/application/form-input";
import { Mail, Lock } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isCoutDown, setIsCountDown] = useState(true);

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
    // Here We Get The user Email From the Local Storage And Assign it to user Email
    let userEmail = "";
    if (userEmail) {
      setEmail(userEmail);
    } else {
      //   router.push("/forgot-password");
    }
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const resendVerificationCode = () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/forgot-password";
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
    axios
      .request(config)
      .then((response: any) => {
        setLoading(false);
        setTimeLeft(120);
        setIsCountDown(true);
        successToast("Success", "Verification code sent sucessfully!");
      })
      .catch((error: any) => {
        setLoading(false);
        errorToast(
          "An Error Occured, Please try again later",
          error?.response?.data?.message || error.message || ""
        );
      });
  };

  const validateOTP = async () => {
    const axios = require("axios");
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/check-otp";
    let config = {
      url: url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { otp: otp, email: email },
    };
    try {
      const request = await axios.request(config);
      if (!request.data.success) {
        setLoading(false);
        errorToast("Invalid OTP", "The OTP is InCorrect");
      } else {
        await resetPassword();
      }
    } catch (error: any) {
      setLoading(false);
      errorToast(
        "Invalid OTP",
        error?.response?.data?.message || error.message || ""
      );
    }
  };

  const resetPassword = async () => {
    const axios = require("axios");
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/reset-password";
    let config = {
      url: url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        secret_key: process.env.NEXT_PUBLIC_SECRET_KEY,
      },
      data: {
        email: email,
        password: password,
        password_confirmation: confirm_password,
      },
    };
    try {
      await axios.request(config);
      successToast("Password Reset Successful", "Redirecting You To Login");
      router.push("/login");

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      errorToast(
        "Failed to reset password",
        error?.response?.data?.message || error.message || ""
      );
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (password !== confirm_password) {
      errorToast(
        "Invalid Password",
        "Password must match with Confirm Password"
      );
      return;
    }
    try {
      setLoading(true);
      await validateOTP();
    } catch (error: any) {
      errorToast(
        "Failed to reset password",
        error?.response?.data?.message || error.message || ""
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      className="pt-7 w-full flex flex-col"
    >
      {loading && <LoadingSpinner />}
      <p className="font-bold text-3xl text-[#292929] pb-5">
        Reset Your Password
      </p>
      <p className="font-medium text-[15px] text-tremor-content-grayText pb-4">
        Enter the 5 digit verification code sent to your email address.
        Didn&apos;t receive a code?{" "}
        {isCoutDown ? (
          <>
            you can request for a new code after{" "}
            <b>
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </b>
          </>
        ) : (
          <>
            <button
              onClick={resendVerificationCode}
              type="button"
              className="outline-none bg-none border-none font-bold"
            >
              Request new code
            </button>
          </>
        )}
      </p>

      <div className="w-full pb-5 flex flex-col gap-2.5">
        <p className="text-base font-normal text-tremor-content-grayText">
          OTP
        </p>
        <InputOTP maxLength={5} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup className="gap-3">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
          </InputOTPGroup>
        </InputOTP>
      </div>
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
        label="New Password"
        placeholder="Enter Password"
        value={password}
      />
      <FormInput
        icon={<Lock width={17} />}
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        label="Confirm Password"
        placeholder="Confirm Password"
        value={confirm_password}
      />

      <button
        type="submit"
        className="w-full bg-tremor-background-lightYellow font-semibold text-base text-[#FDFAEF] flex items-center justify-center hover:bg-tremor-background-lightYellow/80 duration-300 h-12 rounded-2xl "
      >
        Reset Password
      </button>
    </form>
  );
}
