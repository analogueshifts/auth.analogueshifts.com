import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { ToastProvider } from "@/contexts/toast";
import ToastMessage from "@/components/application/toast-message";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnalogueShifts Authentication",
  description: "Sign In to your Account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(plusJakartaSans.className)}>
        {" "}
        <ToastProvider>
          <ToastMessage />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
