"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";

import Input, { type InputType } from "@/components/input/input";
import Button, { type ButtonType } from "@/components/button/button";
import OAuthProviders from "@/components/oauth-providers/oauth.providers";

import { SignInAction } from "@/actions/auth.actions";

import { validateForm } from "@/utils/validator";

export default function SignIn() {
  const emailRef = useRef<InputType>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;

    try {
      setIsFetching(true);
      await SignInAction({ email, password, type: "credentials" });
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    emailRef?.current?.setFocus();
  }, []);

  return (
    <div className="rounded-lg p-12 sm:w-full md:w-1/2 lg:w-1/3">
      <h1 className="mb-7 text-center text-2xl font-bold">로그인</h1>
      <form className="w-full" onSubmit={handleSubmit} noValidate>
        <Input
          ref={emailRef}
          inputType="text"
          inputValue={email}
          onChange={setEmail}
          required={{
            isRequired: true,
            invalidMessage: "이메일을 입력해주세요",
          }}
          labelText="이메일"
        />
        <Input
          inputType="password"
          inputValue={password}
          onChange={setPassword}
          labelText="비밀번호"
          required={{
            isRequired: true,
            invalidMessage: "비밀번호를 입력해주세요",
          }}
          pattern={{
            regExp: new RegExp(
              /^(?=.*[a-zA-Z])(?=.*[!"#$%&'()*+,\-.\/:;`₩\\<=>?@\[\]^_{|}~])(?=.*[0-9]).{8,20}$/,
            ),
            invalidMessage:
              "영문자, 숫자, 특수문자를 포함 최소 8~20자로 입력해주세요",
          }}
        />
        <Button type="submit" isFetching={isFetching} additionalClass="w-full">
          로그인
        </Button>
      </form>
      <div className="mt-3 flex w-full items-center justify-end gap-1 font-semibold text-gray-400">
        <Link className="text-sm hover:text-blue-400" href="/sign-up">
          회원가입
        </Link>
        ·
        <Link className="text-sm hover:text-blue-400" href="/find-password">
          비밀번호 찾기
        </Link>
      </div>
      <div className="flex items-center py-5 text-xs uppercase text-gray-400 before:me-4 before:flex-1 before:border-t before:border-gray-200 after:ms-4 after:flex-1 after:border-t after:border-gray-200 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
        다른 계정으로 로그인
      </div>
      <OAuthProviders />
    </div>
  );
}
