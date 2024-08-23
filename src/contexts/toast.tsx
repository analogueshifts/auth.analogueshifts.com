"use client";
import { createContext, useContext, useState } from "react";

const ToastContext: any = createContext(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState("");
  const [position, setPosition] = useState("right");
  const [message, setMessage] = useState("");

  const notifyUser = (toast: string, message: string, position?: string) => {
    setToast(toast);
    setMessage(message);
    setPosition(position || "right");

    setTimeout(() => {
      setMessage("");
      setToast("");
      setPosition("right");
    }, 4000);
  };

  return (
    <ToastContext.Provider
      value={{
        toast,
        position,
        message,
        notifyUser,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
