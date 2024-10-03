"use server";

import { checkFormData, checkParams } from "@/actions";

import { SendMethod } from "@/types/common";

import {
  createUser,
  checkMobilePhone,
  findEmailByNameAndMobilePhone,
  generatePasswordResetVerification,
  checkUserHasLinkedProvider,
  findUserByEmail,
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
  const response: AuthActionResponse = {
    ok: true,
    message: "로그인되었습니다",
  };
  try {
    const { email, password } = params;
    await signIn("credentials", { email, password, redirect: false });
  } catch (e: any) {
    response.ok = false;
    response.message = e.cause.err.message;
  } finally {
    return response;
  }
}

export async function SignInByOAuthAction(params: SignInParams) {
  await signIn(params.type, {
    redirect: true,
    redirectTo: params.currentUrl ?? "/",
  });
}

export async function SignUpAction(formData: FormData) {
  const response: AuthActionResponse = {
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
  const response: AuthActionResponse = {
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
  const response: AuthActionResponse = {
    ok: true,
    message: "이메일이 발송되었습니다.",
  };
  try {
    const user = await findUserByEmail(email);
    if (!user) throw new Error("이메일을 확인해주세요.");

    // 소셜 로그인으로 연동되어있는지 확인
    if (await checkUserHasLinkedProvider(user.id))
      throw new Error("소셜 로그인으로 가입된 이메일입니다.");

    // 인증 값 생성
    const verifyValue: string = await generatePasswordResetVerification(
      email,
      "MAIL",
    );

    // 이메일 발송
  } catch (e: any) {
    response.ok = false;
    response.message = e.message;
  } finally {
    return response;
  }
}

export async function VerifyPasswordResetValue(
  value: string,
  sendMethod: SendMethod,
) {
  const response: AuthActionResponse = {
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
