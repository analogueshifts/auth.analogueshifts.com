import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";
import { useToast } from "@/contexts/toast";

interface LoginParams {
  email: string;
  password: string;
  setLoading: (value: boolean) => void;
  handleBadCredentials?: any;
}

interface GetUserParams {
  setLoading: (value: boolean) => void;
}

interface RegisterParams {
  setLoading: (value: boolean) => void;
  data: any;
}

interface SendOTPParams {
  setLoading: (value: boolean) => void;
  userToken?: string;
}

interface validateOTPParams {
  setLoading: (value: boolean) => void;
  otp: string;
  handleError: any;
  handleSuccess: any;
}

export const useAuth = () => {
  const router = useRouter();
  const { notifyUser }: any = useToast();

  const token = Cookies.get("token");

  const login = async ({
    email,
    password,
    setLoading,
    handleBadCredentials,
  }: LoginParams) => {
    setLoading(true);
    try {
      const response = await axios.request({
        method: "POST",
        url: "/login",
        data: { email, password },
        headers: {
          "Content-Type": "application/json",
          "x-api-secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
          "x-api-public-key": process.env.NEXT_PUBLIC_PUBLIC_KEY,
        },
      });

      if (response?.data?.success) {
        notifyUser("success", "Logged In successful");
        let t = response.data.data.token;
        Cookies.set("token", t);
        // if (!response.data.data.user?.email_verified_at) {
        //   await sendOTP({ setLoading, userToken: t });
        //   router.push("/email-verification");
        // } else {
        //   router.push("/app-login");
        // }
        router.push("/app-login");
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      notifyUser(
        "error",
        error?.response?.data?.message || error?.message || "Failed to Login"
      );
      if (error?.response?.status === 401) {
        if (handleBadCredentials) {
          handleBadCredentials();
        }
      }
    }
  };

  const getUser = async ({ setLoading }: GetUserParams) => {
    setLoading(true);
    try {
      const response = await axios.request({
        url: "/user",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setLoading(false);
      console.log(response);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const generateGoogleAuthLink = async () => {
    const config = {
      url: "/auth/google/redirect",
      method: "GET",
    };

    try {
      const res = await axios.request(config);
      if (res.data?.success) {
        let url = res?.data?.data?.auth_url;
        if (url) {
          window.location.href = url;
        }
      }
    } catch (error: any) {
      notifyUser(
        "error",
        error?.response?.data?.message || error?.message || "An error occurred"
      );
    }
  };

  const validateGoogleLogin = async ({ code }: { code: string }) => {
    const config = {
      url: "/auth/google/callback?code=" + code,
      method: "GET",
    };
    try {
      const res = await axios.request(config);
      console.log(res);

      if (res.data?.success) {
        Cookies.set("token", res.data?.data?.token || "");
        notifyUser("success", "Logged in successfully", "right");
        router.push("/app-login");
      } else {
        notifyUser("error", res?.data?.message || "An error occurred");
        router.push("/app-login");
      }
    } catch (error: any) {
      notifyUser(
        "error",
        error?.response?.data?.message || error?.message || "An error occurred"
      );
    }
  };

  const register = async ({ setLoading, data }: RegisterParams) => {
    setLoading(true);
    try {
      const response = await axios.request({
        method: "POST",
        url: "/register",
        data,
        headers: {
          "Content-Type": "application/json",
          "x-api-secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
          "x-api-public-key": process.env.NEXT_PUBLIC_PUBLIC_KEY,
        },
      });

      if (response.status === 200) {
        let t = response.data[0]?.data?.token;
        Cookies.set("token", t);
        await sendOTP({ setLoading, userToken: t });
        notifyUser("success", "Account created successfully");

        if (data.user_mode === "job") {
          // Cookies.set("redirect-from-verification", "/job-seeker-kyc");
          router.push("/job-seeker-kyc");
        } else {
          router.push("/app-login");
        }

        // router.push("/email-verification");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      notifyUser(
        "error",
        error?.response?.data?.data?.message ||
          error?.message ||
          "Failed to Create Account"
      );
    }
  };

  const sendOTP = async ({ setLoading, userToken }: SendOTPParams) => {
    setLoading(true);
    try {
      await axios.request({
        url: "/email/verification-notification",
        method: "POST",
        headers: {
          Authorization: "Bearer " + userToken || token,
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const validateOTP = async ({
    setLoading,
    otp,
    handleError,
    handleSuccess,
  }: validateOTPParams) => {
    setLoading(true);
    try {
      await axios.request({
        url: "/email/verification-otp",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        data: { OTP: otp },
      });
      setLoading(false);
      handleSuccess();
    } catch (error: any) {
      setLoading(false);
      notifyUser("error", error?.response?.data?.message || "An error occured");
      handleError();
    }
  };

  return {
    login,
    getUser,
    register,
    sendOTP,
    validateOTP,
    validateGoogleLogin,
    generateGoogleAuthLink,
  };
};
