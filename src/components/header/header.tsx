"use client";

import Link from "next/link";

import { signOut } from "next-auth/react";
import { type Session } from "next-auth";

type HeaderProps = {
  session: Session | null;
};

export default function MainHeader(props: HeaderProps) {
  const { session } = props;

  return (
    <header className="flex h-12 items-center justify-between bg-black p-4">
      <div className="inline-flex gap-4 text-white">
        <Link href="/">Home</Link>
        <Link href="/products">상품</Link>
        <Link href="/management">관리자</Link>
      </div>
      <div className="flex gap-2">
        {session ? (
          <a
            className="text-sm font-semibold text-gray-400 hover:cursor-pointer hover:text-blue-400"
            onClick={() => signOut()}
          >
            로그아웃
          </a>
        ) : (
          <Link
            className="text-sm font-semibold text-gray-400 hover:cursor-pointer hover:text-blue-400"
            href={"/sign-in"}
            scroll={false}
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
