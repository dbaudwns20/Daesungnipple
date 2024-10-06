"use client";

import { useState, useRef, useEffect, useTransition, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Input, { type InputType } from "@/components/input/input";
import Button, { type ButtonType } from "@/components/button/button";
import OAuthProviders from "@/components/oauth-providers/oauth.providers";

import { SignInAction } from "@/actions/auth.actions";

import { validateForm } from "@/utils/validator";
import { showToast } from "@/utils/message";

export default function SignIn() {
  const router = useRouter();

  const emailRef = useRef<InputType>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isFetching, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;

    startTransition(async () => {
      SignInAction({ email, password }).then((res) => {
        if (res.ok) router.replace("/");
        else showToast({ message: res.message });
      });
    });
  };

  useEffect(() => {
    emailRef?.current?.setFocus();
  }, []);

  return (
    <div className="p-12">
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
      <OAuthProviders />
      <div className="mt-5 flex w-full items-center justify-center gap-1.5 font-semibold text-gray-500">
        <Link className="hover:text-blue-400" href="/find?target=email">
          이메일 찾기
        </Link>
        ·
        <Link className="hover:text-blue-400" href="/find?target=password">
          비밀번호 찾기
        </Link>
        ·
        <Link className="hover:text-blue-400" href="/sign-up">
          회원가입
        </Link>
      </div>
    </div>
  );
}
