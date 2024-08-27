"use client";
import axios from "@/lib/axios";

import Cookies from "js-cookie";
import { useToast } from "@/contexts/toast";
import { useRouter } from "next/navigation";

export const useKyc = () => {
  const { notifyUser }: any = useToast();
  const router = useRouter();
  const token = Cookies.get("token");

  interface UpdateKYCParams {
    setLoading: (value: boolean) => void;
    data: any;
  }

  const updateKyc = async ({ setLoading, data }: UpdateKYCParams) => {
    let config = {
      method: "POST",
      url: "/update/kyc",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data,
    };
    setLoading(true);
    try {
      const request = await axios.request(config);
      setLoading(false);
      if (request?.data?.success) {
        notifyUser("success", "KYC Information Updated");
      }
    } catch (error: any) {
      notifyUser(
        "error",
        error?.response?.data?.message ||
          error?.response?.data?.data?.message ||
          "Failed To Update KYC"
      );
      setLoading(false);
      if (error?.response?.status === 401) {
        Cookies.remove("token");
        Cookies.remove("job-seeker-kyc-info");
        router.push("/login");
      }
    }
  };

  return {
    updateKyc,
  };
};
