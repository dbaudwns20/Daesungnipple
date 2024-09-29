"use client";

import { useState, useRef, useEffect, useTransition, FormEvent } from "react";

import Input, { type InputType } from "@/components/input/input";
import Button, { type ButtonType } from "@/components/button/button";

import { PASSWORD_RULE, validateForm } from "@/utils/validator";

export default function ResetPassword() {
  const passwordRef = useRef<InputType>(null);
  const submitRef = useRef<ButtonType>(null);

  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [isFetching, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;
    startTransition(async () => {});
  };

  useEffect(() => {
    passwordRef.current?.setFocus();
  }, []);

  return (
    <div className="p-12">
      <h1 className="mb-7 text-center text-2xl font-bold">비밀번호 초기화</h1>
      <form className="w-full" onSubmit={handleSubmit} noValidate>
        <Input
          ref={passwordRef}
          inputType="password"
          inputValue={password}
          onChange={setPassword}
          labelText="비밀번호"
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
          labelText="비밀번호확인"
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
          비밀번호 초기화
        </Button>
      </form>
    </div>
  );
}
