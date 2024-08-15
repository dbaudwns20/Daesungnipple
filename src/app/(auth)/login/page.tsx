"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

import Input, { type InputType } from "@/components/input/input";
import Button, { type ButtonType } from "@/components/button/button";

import { validateForm } from "@/utils/validator";

export default function Login() {
  const usernameRef = useRef<InputType>(null);

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [number, setNumber] = useState<number>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) {
      return;
    }

    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      alert("성공");
    }, 1500);
  };

  useEffect(() => {
    usernameRef?.current?.setFocus();
  }, []);

  return (
    <div className="rounded-md border border-gray-300 p-14 lg:w-1/2 xl:w-1/3">
      <h1 className="text-center text-2xl font-bold">로그인</h1>
      <form
        className="grid h-full grid-cols-1 gap-5 p-5"
        onSubmit={handleSubmit}
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
              /^(?=.*[a-zA-Z])(?=.*[!"#$%&'()*+,\-.\/:;`₩\\<=>?@\[\]^_{|}~])(?=.*[0-9]).{8,20}$/,
            ),
            invalidMessage:
              "영문자, 숫자, 특수문자를 포함 최소 8~20자로 입력해주세요",
          }}
        />
        <Input
          inputType="number"
          inputValue={number}
          onChange={setNumber}
          valueRange={[1, 10]}
          required={{
            isRequired: true,
            invalidMessage: "숫자를 입력해주세요",
          }}
          labelText="숫자"
        />
        <Button type="submit" buttonText="로그인" isFetching={isFetching} />
      </form>
    </div>
  );
}
