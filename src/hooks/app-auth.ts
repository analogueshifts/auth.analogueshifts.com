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
      if (app === "main") {
        return process.env.NEXT_PUBLIC_MAIN_SITE_BUILD_UUID;
      } else if (app === "events") {
        return process.env.NEXT_PUBLIC_EVENTS_BUILD_UUID;
      } else {
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

      if (error?.response?.status === 401) {
        router.push("/login");
      }
    }
  };

  return {
    login,
  };
};
