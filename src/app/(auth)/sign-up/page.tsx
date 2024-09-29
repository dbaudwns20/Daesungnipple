"use client";

import { useState, useRef, useEffect, useTransition, FormEvent } from "react";
import { useSearchParams } from "next/navigation";

import Input, { type InputType } from "@/components/input/input";
import Button, { type ButtonType } from "@/components/button/button";

import { SignUpAction } from "@/actions/auth.actions";
import { forceRedirect } from "@/actions";

import { showToast } from "@/utils/message";

import {
  validateForm,
  EMAIL_RULE,
  PASSWORD_RULE,
  PHONE_RULE,
} from "@/utils/validator";

export default function SignUp() {
  const searchParams = useSearchParams();

  const emailRef = useRef<InputType>(null);
  const nameRef = useRef<InputType>(null);

  const [email, setEmail] = useState<string>(searchParams.get("email") ?? "");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mobilePhone, setMobilePhone] = useState<string>("");
  const image: string = searchParams.get("image") ?? "";
  const provider: string = searchParams.get("provider") ?? "";
  const isOAuthSignUp: boolean = !!provider;

  const [isFetching, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;

    const formData: FormData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("mobilePhone", mobilePhone);

    if (provider) {
      formData.append("image", image);
      formData.append("provider", provider);
    } else formData.append("password", password);

    startTransition(async () => {
      SignUpAction(formData).then((res) => {
        showToast({ message: res.message });
        if (res.ok) forceRedirect("/sign-in", "replace"); // 라우트 인터셉트 방지
      });
    });
  };

  useEffect(() => {
    if (!isOAuthSignUp) emailRef?.current?.setFocus();
    else nameRef?.current?.setFocus();
  }, [isOAuthSignUp]);

  return (
    <div className="p-12">
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
        {provider === "" ? (
          <>
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
          </>
        ) : (
          <></>
        )}
        <Input
          ref={nameRef}
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
            invalidMessage: "올바른 휴대전화번호 형식이 아닙니다",
          }}
        />
        <Button type="submit" isFetching={isFetching} additionalClass="w-full">
          회원가입
        </Button>
      </form>
    </div>
  );
}
