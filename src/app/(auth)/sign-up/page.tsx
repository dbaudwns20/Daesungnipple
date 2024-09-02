"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useSearchParams } from "next/navigation";

import Input, { type InputType } from "@/components/input/input";
import Button, { type ButtonType } from "@/components/button/button";
import OAuthProviders from "@/components/oauth-providers/oauth.providers";

import {
  validateForm,
  EMAIL_RULE,
  PASSWORD_RULE,
  PHONE_RULE,
} from "@/utils/validator";

export default function SignUp() {
  const searchParams = useSearchParams();

  const emailRef = useRef<InputType>(null);
  const passwordRef = useRef<InputType>(null);

  const [email, setEmail] = useState<string>(searchParams.get("email") ?? "");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [name, setName] = useState<string>(searchParams.get("name") ?? "");
  const [mobilePhone, setMobilePhone] = useState<string>("");

  const provider: string = searchParams.get("provider") ?? "";
  const isOAuthSignUp: boolean = !!provider;

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;

    setIsFetching(true);

    const res = await fetch("/api/auth/sign-up", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ email, password, name, mobilePhone, provider }),
    });

    setIsFetching(false);

    if (res.ok) {
    } else {
      // error handling
    }
  };

  useEffect(() => {
    if (!isOAuthSignUp) emailRef?.current?.setFocus();
    else passwordRef?.current?.setFocus();
  }, [isOAuthSignUp]);

  return (
    <div className="rounded-lg p-12 sm:w-full md:w-1/2 lg:w-1/3">
      <h1 className="mb-7 text-center text-2xl font-bold">회원가입</h1>
      <form className="w-full" onSubmit={handleSubmit} noValidate>
        <Input
          ref={emailRef}
          inputType="email"
          inputValue={email}
          onChange={setEmail}
          isDisabled={isOAuthSignUp}
          required={{
            isRequired: true,
            invalidMessage: "이메일을 입력해주세요",
          }}
          pattern={{
            regExp: EMAIL_RULE,
            invalidMessage: "올바른 이메일 형식이 아닙니다",
          }}
          labelText="이메일"
        />
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
            regExp: new RegExp(password),
            invalidMessage: "비밀번호가 일치하지 않습니다",
          }}
        />
        <Input
          inputType="text"
          inputValue={name}
          onChange={setName}
          labelText="이름"
          isDisabled={isOAuthSignUp}
          required={{
            isRequired: true,
            invalidMessage: "이름을 입력해주세요",
          }}
        />
        <Input
          inputType="text"
          inputValue={mobilePhone}
          onChange={setMobilePhone}
          labelText="휴대전화번호"
          required={{
            isRequired: true,
            invalidMessage: "휴대전화번호를 입력해주세요",
          }}
          pattern={{
            regExp: PHONE_RULE,
            invalidMessage: "올바른 휴대전화번호 형식이 아닙니다.",
          }}
        />
        <Button type="submit" isFetching={isFetching} additionalClass="w-full">
          회원가입
        </Button>
      </form>
    </div>
  );
}
