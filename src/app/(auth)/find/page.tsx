"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Find() {
  const searchParams = useSearchParams();

  const [target, setTarget] = useState(searchParams.get("target"));

  return (
    <div className="rounded-lg p-12 sm:w-full md:w-1/2 lg:w-1/3">
      <h1 className="mb-7 text-center text-2xl font-bold">로그인</h1>
    </div>
  );
}
