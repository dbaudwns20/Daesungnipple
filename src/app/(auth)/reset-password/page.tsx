"use client";

import {
  useState,
  useRef,
  useEffect,
  useTransition,
  FormEvent,
  useCallback,
} from "react";
import { useSearchParams } from "next/navigation";

import Input, { type InputType } from "@/components/input";
import Button, { type ButtonType } from "@/components/button";

import {
  VerifyPasswordResetValue,
  ResetNewPassword,
} from "@/actions/auth.actions";
import { forceRedirect } from "@/actions";

import { PASSWORD_RULE, validateForm } from "@/utils/validator";
import { showToast } from "@/utils/message";

type VerifyPasswordResetValueResData = {
  verification: string;
};

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const value: string | null = searchParams.get("value");

  const passwordRef = useRef<InputType>(null);
  const submitRef = useRef<ButtonType>(null);

  const [isValid, setIsValid] = useState<boolean>(false);
  const [resData, setResData] =
    useState<VerifyPasswordResetValueResData | null>(null);
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [isFetching, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;

    startTransition(async () => {
      ResetNewPassword(resData!.verification, password, "MAIL").then((res) => {
        showToast({ message: res.message });
        if (res.ok) {
          forceRedirect("/sign-in", "replace");
        }
      });
    });
  };

  const checkValueIsValid = useCallback(async () => {
    if (!value) {
      showToast({ message: "인증이 유효하지 않습니다." });
      forceRedirect("/sign-in", "replace");
    } else {
      const res = await VerifyPasswordResetValue(value, "MAIL");
      if (!res.ok) {
        showToast({ message: res.message });
        forceRedirect("/sign-in", "replace");
      } else {
        setResData(res.data as VerifyPasswordResetValueResData);
        setIsValid(true);
      }
    }
  }, [value]);

  useEffect(() => {
    setTimeout(async () => {
      await checkValueIsValid();
    });
  }, [checkValueIsValid]);

  useEffect(() => {
    if (isValid) passwordRef.current?.setFocus();
  }, [isValid]);

  return (
    <div className="p-12">
      {isValid ? (
        <>
          <h1 className="mb-7 text-center text-2xl font-bold">
            비밀번호 재설정
          </h1>
          <form className="w-full" onSubmit={handleSubmit} noValidate>
            <Input
              ref={passwordRef}
              inputType="password"
              inputValue={password}
              onChange={setPassword}
              labelText="신규 비밀번호"
              required={{
                isRequired: true,
                invalidMessage: "비밀번호를 입력해주세요",
              }}
              pattern={{
                regExp: PASSWORD_RULE,
                invalidMessage:
                  "영문자, 숫자, 특수문자를 포함 최소 8~20자로 입력해주세요",
              }}
            />
            <Input
              inputType="password"
              inputValue={passwordCheck}
              onChange={setPasswordCheck}
              labelText="신규 비밀번호확인"
              required={{
                isRequired: true,
                invalidMessage: "비밀번호확인을 입력해주세요",
              }}
              pattern={{
                regExp: password ? new RegExp(`^${password}$`) : /^(?!.*)/,
                invalidMessage: "비밀번호가 일치하지 않습니다",
              }}
            />
            <Button
              ref={submitRef}
              type="submit"
              isFetching={isFetching}
              additionalClass="w-full"
            >
              비밀번호 재설정
            </Button>
          </form>
        </>
      ) : (
        <div className="flex h-[320px] w-full items-center justify-center">
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
          <p className="text-gray-800">확인중...</p>
        </div>
      )}
    </div>
  );
}
