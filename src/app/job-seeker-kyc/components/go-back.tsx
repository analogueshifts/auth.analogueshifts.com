"use client";
import { useRouter } from "next/navigation";

import Image from "next/image";
import ArrowLeft from "@/assets/images/job-seeker-kyc/arrow-left.svg";

export default function GoBack() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="w-max flex items-center gap-1.5 large:gap-3 bg-none outline-none text-base large:text-xl font-normal text-headingText"
    >
      <Image src={ArrowLeft} alt="" className="h-max large:w-max w-5" />
      Go back
    </button>
  );
}
