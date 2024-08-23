"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
        // Toast
      })
      .catch((error: any) => {
        setLoading(false);
        // Toast
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
        //  Toast
      } else {
        await resetPassword();
      }
    } catch (error: any) {
      setLoading(false);
      //  Toast
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
      // Toast
      router.push("/login");

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      //  Toast
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (password !== confirm_password) {
      // errorToast(
      //   "Invalid Password",
      //   "Password must match with Confirm Password"
      // );
      return;
    }
    try {
      setLoading(true);
      await validateOTP();
    } catch (error: any) {
      // errorToast(
      //   "Failed to reset password",
      //   error?.response?.data?.message || error.message || ""
      // );
      console.log(error);
    }
  };

  return <form></form>;
}
