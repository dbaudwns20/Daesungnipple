"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

import Input, { type InputType } from "@/components/input/input";

import { validateForm } from "@/utils/validator";

export default function Login() {
  const usernameRef = useRef<InputType>(null);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;

    alert("성공");
  };

  useEffect(() => {
    usernameRef?.current?.setFocus();
  }, []);

  return (
    <div className="border border-gray-300 rounded-md p-14 xl:w-1/2">
      <h1 className="text-center text-2xl font-bold">로그인</h1>
      <form
        className="grid grid-cols-1 gap-4 p-5 h-full"
        onSubmit={login}
        noValidate
      >
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
              /^(?=.*[a-zA-Z])(?=.*[!"#$%&'()*+,\-.\/:;`₩\\<=>?@\[\]^_{|}~])(?=.*[0-9]).{8,20}$/
            ),
            invalidMessage:
              "영문자, 숫자, 특수문자를 포함 최소 8~20자로 입력해주세요",
          }}
        />
        <button
          className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block w-full"
          type="submit"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
