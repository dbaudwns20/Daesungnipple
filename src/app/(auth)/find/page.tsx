"use client";

import {
  useState,
  useRef,
  useTransition,
  useEffect,
  useCallback,
  FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Input, { type InputType } from "@/components/input/input";
import Button, { type ButtonType } from "@/components/button/button";

import { FindUserEmail, SendPasswordRestEmail } from "@/actions/auth.actions";
import { forceRedirect } from "@/actions";

import { EMAIL_RULE, PHONE_RULE, validateForm } from "@/utils/validator";
import { showToast } from "@/utils/message";

type FindEmailResult = {
  email: string;
  hasProvider: boolean;
};

export default function Find() {
  const searchParams = useSearchParams();

  // refs
  const emailRef = useRef<InputType>(null);
  const nameRef = useRef<InputType>(null);

  // values
  let target: string = searchParams.get("target")!;

  const [findEmailResult, setFindEmailResult] =
    useState<FindEmailResult | null>(null);
  const [findPasswordResult, setFindPasswordResult] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mobilePhone, setMobilePhone] = useState<string>("");

  const [isFetching, startTransition] = useTransition();

  const initValues = useCallback(() => {
    setFindEmailResult(null);
    setFindPasswordResult(false);
    setEmail("");
    setName("");
    setMobilePhone("");
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;

    if (target === "email") {
      startTransition(async () => {
        FindUserEmail({ name, mobilePhone }).then((res) => {
          if (res.ok) setFindEmailResult(res.data as FindEmailResult);
          else showToast({ message: res.message });
        });
      });
    } else {
      startTransition(async () => {
        SendPasswordRestEmail(email).then((res) => {
          showToast({ message: res.message });
          if (res.ok) setFindPasswordResult(true);
        });
      });
    }
  };

  useEffect(() => {
    if (target === "password") emailRef.current?.setFocus();
    else nameRef.current?.setFocus();
    initValues();
  }, [target, initValues]);

  return (
    <div className="p-12">
      <div className="tabs">
        <ul>
          <li>
            <Link
              className={`tab ${target === "email" ? "is-active" : ""}`}
              href="/find?target=email"
              replace
            >
              이메일
            </Link>
          </li>
          <li>
            <Link
              className={`tab ${target === "password" ? "is-active" : ""}`}
              href="/find?target=password"
              replace
            >
              비밀번호
            </Link>
          </li>
        </ul>
      </div>
      <h1 className="mb-7 text-center text-2xl font-bold">
        {target === "password" ? "비밀번호 찾기" : "이메일 찾기"}
      </h1>
      <form className="w-full" onSubmit={handleSubmit} noValidate>
        {target === "password" ? (
          <>
            {!findPasswordResult ? (
              <>
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
                <Button
                  type="submit"
                  isFetching={isFetching}
                  additionalClass="w-full"
                >
                  비밀번호 찾기
                </Button>
              </>
            ) : (
              <div className="text-center font-semibold text-gray-700">
                <div className="mb-7">
                  <p className="mb-5 font-bold text-blue-500">{email}</p>
                  입력된 메일로 비밀번호 초기화 이메일을 발송했습니다.
                  <br />
                  이메일을 확인해주세요.
                </div>
                <p className="mb-7 rounded-lg border border-gray-300 py-3 text-sm font-bold text-blue-500">
                  해당 이메일은 발송후 1시간 동안만 유효합니다.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {!findEmailResult ? (
              <>
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
                <Button
                  type="submit"
                  isFetching={isFetching}
                  additionalClass="w-full"
                >
                  이메일 찾기
                </Button>
              </>
            ) : (
              <div className="text-center text-sm font-semibold text-gray-700">
                <p className={findEmailResult.hasProvider ? "mb-7" : "mb-10"}>
                  <span className="font-bold text-blue-500">{name}</span> 님의
                  이메일은{" "}
                  <span className="font-bold text-green-600">
                    {findEmailResult.email}
                  </span>{" "}
                  입니다.
                </p>
                {findEmailResult.hasProvider ? (
                  <p className="mb-7 rounded-lg border border-gray-300 py-3 text-sm font-bold text-blue-500">
                    소셜 로그인으로 가입된 계정입니다.
                    <br />
                    소셜 로그인을 이용해주세요.
                  </p>
                ) : (
                  <></>
                )}
                <Button
                  type="button"
                  additionalClass="w-full"
                  onClick={() => forceRedirect("sign-in", "replace")}
                >
                  로그인하러 가기
                </Button>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
