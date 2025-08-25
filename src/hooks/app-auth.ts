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
      return app;
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
