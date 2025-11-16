// src/app/ReduxLayoutWrapper.tsx (Client Component)
"use client";

import ReduxProvider from "@/provider/reduxProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "../../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ReduxLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
          <Toaster position="top-center" />
          <ReduxProvider>{children}</ReduxProvider>
        </div>
      </body>
    </html>
  );
}
