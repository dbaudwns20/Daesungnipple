"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Input, { type InputType } from "@/components/input/input";
import Button, { type ButtonType } from "@/components/button/button";

import { EMAIL_RULE, PHONE_RULE } from "@/utils/validator";

export default function Find() {
  const searchParams = useSearchParams();

  // refs
  const emailRef = useRef<InputType>(null);
  const nameRef = useRef<InputType>(null);

  // values
  const [target, setTarget] = useState(searchParams.get("target"));
  const [name, setName] = useState<string>("");
  const [mobilePhone, setMobilePhone] = useState<string>("");

  const [isFetching, startTransition] = useTransition();

  const switchTarget = (target: string) => {
    setTarget(target);
  };

  useEffect(() => {
    if (target === "password") emailRef.current?.setFocus();
    else nameRef.current?.setFocus();
  }, [target]);

  return (
    <div className="p-12">
      <div className="tabs">
        <ul>
          <li>
            <a className="tab" onClick={() => switchTarget("email")}>
              이메일
            </a>
          </li>
          <li>
            <a className="tab" onClick={() => switchTarget("password")}>
              비밀번호
            </a>
          </li>
        </ul>
      </div>
      <h1 className="mb-7 text-center text-2xl font-bold">
        {target === "password" ? "비밀번호 찾기" : "이메일 찾기"}
      </h1>
      <form className="w-full" noValidate>
        <Input
          ref={nameRef}
          inputType="text"
          inputValue={name}
          onChange={setName}
          required={{
            isRequired: true,
            invalidMessage: "이름을 입력해주세요",
          }}
          labelText="이름"
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
          이메일 찾기
        </Button>
      </form>
    </div>
  );
}
