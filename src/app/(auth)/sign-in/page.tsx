"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

import Input, { type InputType } from "@/components/input/input";
import Button, { type ButtonType } from "@/components/button/button";

import { signIn } from "@/auth";

import { validateForm } from "@/utils/validator";

export default function SignIn() {
  const usernameRef = useRef<InputType>(null);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;

    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      alert("성공");
    }, 1500);
  };

  const signInByOAuth = async (type: string) => {
    await signIn(type);
  };

  useEffect(() => {
    usernameRef?.current?.setFocus();
  }, []);

  return (
    <div className="rounded-md border border-gray-300 p-10 lg:w-1/2 xl:w-1/3">
      <h1 className="text-center text-2xl font-bold">로그인</h1>
      <form className="w-full" onSubmit={handleSubmit} noValidate>
        <Input
          ref={usernameRef}
          inputType="text"
          inputValue={username}
          onChange={setUsername}
          required={{
            isRequired: true,
            invalidMessage: "아이디를 입력해주세요",
          }}
          labelText="아이디"
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
        <div className="w-full">
          <Button
            type="submit"
            isFetching={isFetching}
            additionalClass="w-full"
          >
            로그인
          </Button>
        </div>
      </form>

      <hr className="my-4 h-px w-full bg-gray-200" />

      <div className="grid gap-2.5">
        <Button
          color="blue"
          size="sm"
          type="button"
          additionalClass="w-full"
          isFetching={isFetching}
          onClick={() => signInByOAuth("google")}
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
