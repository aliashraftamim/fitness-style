// src/app/layout.tsx (Server Component)
import type { Metadata } from "next";
import ReduxLayoutWrapper from "./_components/LAYOUT/ReduxLayout";

export const metadata: Metadata = {
  title: "Fitness Style",
  description: "Admin panel of fitness style apk",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReduxLayoutWrapper>{children}</ReduxLayoutWrapper>;
}
