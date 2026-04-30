"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: 999,
            background: "#1d1d1f",
            color: "#fff",
            fontSize: 14,
            padding: "10px 18px",
          },
        }}
      />
    </SessionProvider>
  );
}
