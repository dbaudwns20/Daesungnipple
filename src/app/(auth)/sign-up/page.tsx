"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

import Input, { type InputType } from "@/components/input/input";
import Button, { type ButtonType } from "@/components/button/button";

import {
  validateForm,
  EMAIL_RULE,
  PASSWORD_RULE,
  PHONE_RULE,
} from "@/utils/validator";

export default function SignUp() {
  const emailRef = useRef<InputType>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mobilePhone, setMobilePhone] = useState<string>("");

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;

    setIsFetching(true);

    const res = await fetch("/api/auth/sign-up", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ email, password, name, mobilePhone }),
    });

    console.log(res);

    setIsFetching(false);
  };

  useEffect(() => {
    emailRef?.current?.setFocus();
  }, []);

  return (
    <div className="rounded-md border border-gray-300 p-10 lg:w-1/2 xl:w-1/3">
      <h1 className="text-center text-2xl font-bold">회원가입</h1>
      <form className="w-full" onSubmit={handleSubmit} noValidate>
        <Input
          ref={emailRef}
          inputType="email"
          inputValue={email}
          onChange={setEmail}
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

      <hr className="my-4 h-px w-full bg-gray-200" />

      <div className="grid gap-3">
        <Button
          color="blue"
          size="sm"
          type="button"
          additionalClass="w-full"
          isFetching={isFetching}
        >
          Google 로그인
        </Button>
        <Button
          color="green"
          size="sm"
          type="button"
          additionalClass="w-full"
          isFetching={isFetching}
        >
          네이버 로그인
        </Button>
        <Button
          color="yellow"
          size="sm"
          type="button"
          additionalClass="w-full"
          isFetching={isFetching}
        >
          카카오 로그인
        </Button>
      </div>
    </div>
  );
}
