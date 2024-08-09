"use client";

import { useState } from "react";

import Input from "@/components/input/input";

export default function Login() {
  const [username, setUsename] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="p-15">
      <h1 className="text-center">로그인</h1>
      <form
        className="grid grid-cols-1 gap-5 p-5 h-full rounded-lg shadow-md"
        noValidate
      >
        <Input
          inputType="text"
          inputValue={username}
          onChange={setUsename}
          labelText="아이디"
        />
        <Input
          inputType="password"
          inputValue={password}
          onChange={setPassword}
          labelText="비밀번호"
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
