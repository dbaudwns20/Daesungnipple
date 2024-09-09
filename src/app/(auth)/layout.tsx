import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "대성닛블",
  description: "대성닛블 로그인 · 회원가입 · 비밀번호 찾기 페이지.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className} style={{ height: "100vh" }}>
        <main className="flex h-full w-full items-center justify-center">
          {children}
        </main>
        <div id="message-wrapper"></div>
      </body>
    </html>
  );
}
