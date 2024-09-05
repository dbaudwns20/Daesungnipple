"use server";

import { createUser } from "@/services/auth/sign.up.service";

import { signIn, signOut } from "@/auth";

type AuthActionResponse = {
  ok: boolean;
  message: string;
  data?: any;
};

type SignInParams = {
  email?: string;
  password?: string;
  type?: string;
  currentUrl?: string;
};

export async function SignInAction(params: SignInParams) {
  let { ok, message } = { ok: true, message: "로그인되었습니다." };
  try {
    const { email, password } = params;
    await signIn("credentials", { email, password, redirect: false });
  } catch (e: any) {
    ok = false;
    message = e.cause.err.message;
  } finally {
    return {
      ok,
      message,
    } as AuthActionResponse;
  }
}

export async function SignInByOAuthAction(params: SignInParams) {
  await signIn(params.type, {
    redirect: true,
    redirectTo: params.currentUrl ?? "/",
  });
}

export async function SignUpAction(formData: FormData) {
  let { ok, message } = { ok: true, message: "회원가입이 완료되었습니다." };
  try {
    await createUser(formData);
  } catch (e: any) {
    ok = false;
    message = e.message;
  } finally {
    return {
      ok,
      message,
    } as AuthActionResponse;
  }
}

export async function SignOutAction() {
  await signOut({ redirect: true, redirectTo: "/" });
}
