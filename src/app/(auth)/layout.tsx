import type { Metadata } from "next";

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
    <main className="flex h-[100vh] w-full items-center justify-center">
      <div className="sm:w-full md:w-1/2 lg:w-1/3">{children}</div>
    </main>
  );
}
