import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuvOS — 연애력을 데이터로 만든다",
  description:
    "상대 유형을 설정하고, AI와 갈등 시뮬레이션을 하고, 연구 기반 채점으로 연애력을 측정하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} antialiased`}>
      <body className="h-dvh flex flex-col bg-background text-foreground font-sans overflow-hidden">
        {children}
      </body>
    </html>
  );
}
