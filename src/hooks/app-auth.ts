import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";
import { useToast } from "@/contexts/toast";

interface LoginParams {
  app: string;
  setLoading: (value: boolean) => void;
}

export const useAppAuth = () => {
  const router = useRouter();
  const { notifyUser }: any = useToast();

  const token = Cookies.get("token");

  const login = async ({ app, setLoading }: LoginParams) => {
    const toggleApp = () => {
      switch (app) {
        case "main":
          return process.env.NEXT_PUBLIC_MAIN_SITE_BUILD_UUID;
        case "events":
          return process.env.NEXT_PUBLIC_EVENTS_BUILD_UUID;
        case "forms":
          return process.env.NEXT_PUBLIC_FORMS_BUILD_UUID;
        case "vets":
          return process.env.NEXT_PUBLIC_VETS_BUILD_UUID;
        case "resume":
          return process.env.NEXT_PUBLIC_RESUME_BUILD_UUID;
        case "pay":
          return process.env.NEXT_PUBLIC_PAY_BUILD_UUID;
        case "learn":
          return process.env.NEXT_PUBLIC_LEARN_BUILD_UUID;
        default:
          return process.env.NEXT_PUBLIC_MAIN_SITE_BUILD_UUID;
      }
    };

    try {
      setLoading(true);
      const response = await axios.request({
        method: "GET",
        url: "/app/login/" + toggleApp() || "",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
      });
      if (response?.data?.success) {
        router.push(response.data.data?.callback);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      notifyUser(
        "error",
        error?.response?.data?.message ||
          error?.response?.data?.data?.message ||
          error?.message ||
          "Failed to Login"
      );

      router.push("/login");
    }
  };

  return {
    login,
  };
};
