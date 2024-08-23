"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
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
        // Toast Error
      });
  }

  return <form></form>;
}
