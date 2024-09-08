"use client";

import Link from "next/link";

import { SignOutAction } from "@/actions/auth.actions";

export default function MainHeader() {
  return (
    <header className="flex h-12 items-center justify-between bg-black px-5 text-white">
      <div>
        <Link href="/">Home</Link>
      </div>
      <div className="flex gap-2">
        <Link
          className="text-sm font-semibold text-gray-400 hover:text-blue-400"
          href="/sign-in"
        >
          로그인
        </Link>
        {/* <a
          className="text-sm font-semibold text-gray-400 hover:text-blue-400"
          onClick={() => SignOutAction()}
        >
          로그아웃
        </a> */}
      </div>
    </header>
  );
}
