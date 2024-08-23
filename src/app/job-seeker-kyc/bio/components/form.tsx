"use client";
import Cookies from "js-cookie";
import { useKyc } from "@/hooks/kyc";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Tiptap from "./tiptap";

import Image from "next/image";
import Spinner from "@/assets/images/spinner.svg";

export default function Form() {
  const [bio, setBio] = useState("");
  const { updateKyc } = useKyc();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  let storedInfo = Cookies.get("job-seeker-kyc-info");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!storedInfo) {
      router.push("/job-seeker-kyc");
    }
    if (!token) {
      router.push("/login");
    }
  }, [storedInfo]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (storedInfo) {
      let parsedStoredData = JSON.parse(storedInfo);
      let data = {
        role: parsedStoredData.role,
        biography: bio,
        years_of_experience: parsedStoredData.yearsOfExperience,
        experience_level: parsedStoredData.levelOfExperience,
        preference: parsedStoredData.skills.join(", "),
      };
      try {
        await updateKyc({ data, setLoading });
        router.push("/app-login");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center large:gap-8 gap-6 pb-48"
    >
      <div className="w-full flex flex-col gap-3 large:gap-4">
        <p className="large:text-base text-sm font-normal text-tremor-content-grayText">
          Bio
        </p>
        <Tiptap
          initialData={bio}
          changed={(value) => {
            if (value.length < 300) {
              setBio(value);
            }
          }}
        />
        <p className="-translate-y-1 text-tremor-content-boulder950 large:text-base text-sm font-normal">
          Maximum of 300 words
        </p>
        <button
          type="submit"
          disabled={bio.length <= 7}
          className={`w-full mt-6 bg-tremor-content-asYellow large:h-[60px] h-12 rounded-[20px] flex justify-center items-center text-sm large:text-base font-semibold text-tremor-content-light ${
            bio.length <= 7 ? "opacity-50" : "opacity-100"
          }`}
        >
          {!loading && "Finish"}{" "}
          <Image
            src={Spinner}
            alt=""
            className={`animate-spin ${loading ? "flex" : "hidden"}`}
          />
        </button>
      </div>
    </form>
  );
}
