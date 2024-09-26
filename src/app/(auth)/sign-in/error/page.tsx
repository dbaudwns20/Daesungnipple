"use client";

import { useSearchParams } from "next/navigation";

import { forceRedirect } from "@/actions";

import { showToast } from "@/utils/message";
import { useEffect } from "react";

enum Error {
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  Verification = "Verification",
  Default = "Default",
}

const errorMap = {
  [Error.Configuration]: "잘못된 설정입니다.\n관리자에게 문의해 주세요",
  [Error.AccessDenied]: "접근이 거부되었습니다.\n연동 계정을 확인해 주세요",
  [Error.Verification]: "인증에 실패했습니다.\n다시 시도해 주세요",
  [Error.Default]: "알 수 없는 오류가 발생했습니다.\n다시 시도해 주세요",
};

export default function AuthErrorPage() {
  const search = useSearchParams();

  const error: Error = search.get("error") as Error;
  const errorMessage: string | null = search.get("error_message") ?? null;

  useEffect(() => {
    showToast({ message: errorMessage ?? errorMap[error] });
    forceRedirect("/sign-in", "replace");
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        className="-ml-1 mr-3 h-12 w-12 animate-spin text-gray-500"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-65"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p className="text-gray-800">연결 중...</p>
    </div>
  );
}
