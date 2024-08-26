"use client";
import { useAuth } from "@/hooks/auth";
import { useToast } from "@/contexts/toast";
import { useState, useEffect, FormEvent } from "react";
import Cookies from "js-cookie";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import Spinner from "@/assets/images/spinner.svg";
import ShowStatus from "./show-status";
import { useRouter } from "next/navigation";

export default function EmailVerificationForm() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isCoutDown, setIsCountDown] = useState(true);
  const [status, setStatus] = useState("");

  const { sendOTP, validateOTP } = useAuth();
  const { notifyUser }: any = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

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
  const resendVerificationCode = async () => {
    try {
      await sendOTP({ setLoading });
      setTimeLeft(120);
      setIsCountDown(true);
      notifyUser("success", "Verification code sent sucessfully!");
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Form Submit
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await validateOTP({
        otp: value,
        setLoading,
        handleError: () => {
          setValue("");
          setStatus("error");
        },
        handleSuccess: () => {
          setValue("");
          setStatus("success");
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {status === "" ? (
        <form
          onSubmit={handleSubmit}
          className="w-full h-full pb-10 overflow-y-auto flex justify-center px-6 large:pt-[112px] pt-[56px]"
        >
          <div className="w-[540px] h-max max-w-full flex flex-col items-center">
            <h2 className="w-max text-center leading-48 large:leading-[60px] text-black font-semibold large:text-32 text-2xl mb-2">
              OTP Verification
            </h2>

            <p className="w-max max-w-full font-normal text-tremor-content-boulder400 large:text-xl text-base text-center mb-9 large:mb-12">
              Enter the verification code we just sent on your email.
              Didn&apos;t receive a code?{" "}
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

            <InputOTP
              className="w-full"
              value={value}
              onChange={(e) => setValue(e)}
              maxLength={5}
            >
              <InputOTPGroup className="grid w-full lg:w-[500px] large:w-[540px] tablet:w-full max-w-full grid-cols-5 gap-3.5">
                {[0, 1, 2, 3, 4].map((item) => {
                  return (
                    <InputOTPSlot
                      key={item}
                      className="border min-w-full w-14 lg:w-full lg:h-16 text-[#292929] col-span-1 rounded-[10px] h-14  text-[18px] large:text-[30px] font-bold"
                      index={item}
                    />
                  );
                })}
              </InputOTPGroup>
            </InputOTP>
            <button
              type="submit"
              disabled={value.length < 5}
              className={`w-full bg-tremor-content-asYellow large:h-[60px] h-12 rounded-[20px] flex justify-center items-center text-sm large:text-base font-semibold text-tremor-content-light mt-7 large:mt-10 ${
                value.length < 5 ? "opacity-50" : "opacity-100"
              }`}
            >
              {!loading && "Verify email"}{" "}
              <Image
                src={Spinner}
                alt=""
                className={`animate-spin ${loading ? "flex" : "hidden"}`}
              />
            </button>
          </div>
        </form>
      ) : (
        <ShowStatus handleRetry={() => setStatus("")} status={status} />
      )}
    </>
  );
}
