"use server";

import { checkFormData, checkParams } from "@/actions";

import {
  createUser,
  checkEmail,
  checkMobilePhone,
  findEmailByNameAndMobilePhone,
  generatePasswordResetToken,
} from "@/services/auth.service";

import { signIn } from "@/auth";

interface AuthActionResponse {
  ok: boolean;
  message: string;
  data?: unknown;
}

type SignInParams = {
  email?: string;
  password?: string;
  type?: string;
  currentUrl?: string;
};

export async function SignInAction(params: SignInParams) {
  let { ok, message } = { ok: true, message: "로그인되었습니다" };
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
  let response: AuthActionResponse = {
    ok: true,
    message: "회원가입되었습니다",
  };
  try {
    await checkFormData(formData, ["name", "email", "mobilePhone"]);
    await createUser(formData);
  } catch (e: any) {
    response.ok = false;
    response.message = e.message;
  } finally {
    return response;
  }
}

type FindUserEmailParams = {
  name: string;
  mobilePhone: string;
};

export async function FindUserEmail(params: FindUserEmailParams) {
  let response: AuthActionResponse = {
    ok: true,
    message: "이메일이 확인되었습니다",
    data: null,
  };
  try {
    await checkParams(params, ["name", "mobilePhone"]);
    await checkMobilePhone(params.mobilePhone);
    response.data = await findEmailByNameAndMobilePhone(
      params.name,
      params.mobilePhone,
    );
  } catch (e: any) {
    response.ok = false;
    response.message = e.message;
  } finally {
    return response;
  }
}

export async function SendPasswordRestEmail(email: string) {
  let response: AuthActionResponse = {
    ok: true,
    message: "이메일이 발송되었습니다.",
  };
  try {
    await checkEmail(email);

    // 인증 토큰 생성
    const token: string = await generatePasswordResetToken(email);

    // 이메일 발송
  } catch (e: any) {
    response.ok = false;
    response.message = e.message;
  } finally {
    return response;
  }
}

export async function CheckPasswordResetToken(token: string) {
  let response: AuthActionResponse = {
    ok: true,
    message: "인증되었습니다.",
  };
  try {
  } catch (e: any) {
    response.ok = false;
    response.message = e.message;
  } finally {
    return response;
  }
}
