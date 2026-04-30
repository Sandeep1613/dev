import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sanjay Communications — Premium Mobiles & Accessories",
  description:
    "Discover the latest mobile phones and a curated range of premium accessories — chargers, earphones, smart watches and more.",
  keywords: [
    "mobile phones", "accessories", "Sanjay Communications", "smart watches",
    "chargers", "earphones", "power banks",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
