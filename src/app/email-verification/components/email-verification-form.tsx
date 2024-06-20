"use client";

import { useState, useEffect, FormEvent } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { errorToast, successToast } from "@/utils/toast";
import LoadingSpinner from "@/components/application/loading-spinner";

export default function EmailVerificationForm() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser]: any = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isCoutDown, setIsCountDown] = useState(true);

  // Check if the user is in countDown Mode, if so, decrement the counter.
  // If the counter is = 0, remove the user from countDown mode.
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

  // The Timer minutes and seconds left
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Handle Resend Verification Code
  const resendVerificationCode = () => {
    const axios = require("axios");
    const url =
      process.env.NEXT_PUBLIC_BACKEND_URL + "/email/verification-notification";
    let config = {
      url: url,
      method: "POST",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    };

    setLoading(true);

    axios
      .request(config)
      .then((res: any) => {
        // Start the timer, so the user wait for 2 minutes before requesting for another code.
        setLoading(false);
        setTimeLeft(120);
        setIsCountDown(true);
        successToast("Success", "Verification code sent sucessfully!");
      })
      .catch((error: any) => {
        setLoading(false);
        errorToast("Error", error.message);
        if (error?.response?.status === 401) {
          //  Clear The User Session
        }
      });
  };

  // Handle Form Submit
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const axios = require("axios");
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/email/verification-otp";
    let config = {
      url: url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
      data: { OTP: value },
    };
    setLoading(true);
    axios
      .request(config)
      .then((res: any) => {
        setLoading(false);
        if (res.data.success) {
          const userData = JSON.stringify({
            user: { ...res.data.data.user },
            token: user.token,
          });

          // If the email verification is successful, update the user session value with the latest user session and navigate to the dashboard

          successToast("Success", "Your email has been verified");
        } else {
          setValue("");
          errorToast("Invalid OTP", "The OTP is InCorrect");
        }
      })
      .catch((error: any) => {
        setLoading(false);
        setValue("");
        errorToast(
          "Invalid OTP",
          error?.response?.data?.message || error.message || ""
        );
        if (error?.response?.status === 401) {
          //    Clear User Session
        }
      });
  }

  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      className="pt-7 w-full flex flex-col"
    >
      {loading && <LoadingSpinner />}
      <p className="font-bold text-2xl text-[#292929] pb-5">
        Email verification
      </p>
      <p className="font-medium text-[15px] text-tremor-content-grayText pb-4">
        Please enter the 5 digit verification code sent to your email address.
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
        <InputOTP
          maxLength={5}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup className="gap-3">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <button
        type="submit"
        className="w-full bg-tremor-background-lightYellow font-semibold text-base text-[#FDFAEF] flex items-center justify-center hover:bg-tremor-background-lightYellow/80 duration-300 h-12 rounded-2xl "
      >
        Submit
      </button>
    </form>
  );
}
