"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

import Image from "next/image";
import Logo from "@/assets/images/grid-two-layout/logo.svg";
import Hero from "@/assets/images/grid-two-layout/hero.png";

export default function LayoutGridTwo({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="w-full h-screen flex">
      <div
        className={`bg-tremor-content-asYellow tablet:hidden relative flex flex-col items-center large:w-[645px] w-[500px] px-[61px] large:pt-[112px] pt-14 ${
          pathname === "/register"
            ? "large:h-[calc(100%-116px)] h-[calc(100%-30px)]"
            : "h-full"
        }`}
      >
        <Link
          className="large:mb-14 mb-8"
          href="httpe://www.analogueshifts.com"
        >
          <Image src={Logo} alt="" className="w-max large:h-max h-9" />
        </Link>
        <p className="w-full text-center text-lg large:text-xl font-normal leading-9 large:leading-48 text-[#907222]">
          Join our team and revolutionize the job search experience for
          countless individuals in emerging markets.
        </p>
        <Image
          src={Hero}
          alt=""
          className="max-w-full w-max large:h-max h-[50%]"
        />
        <p className="text-center text-[#907222] absolute bottom-6 font-normal large:text-lg text-base">
          © {new Date().getFullYear()} | All Rights Reserved
        </p>
      </div>
      <div className="h-full bg-white large:w-[calc(100%-645px)] w-[calc(100%-500px)] tablet:w-full">
        {children}
      </div>
    </main>
  );
}
