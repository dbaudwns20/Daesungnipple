"use server";

import { checkFormData, checkParams } from "@/actions";

import { SendMethod } from "@/types/common";

import { sendPasswordResetMail } from "@/utils/mail";

import {
  createUser,
  checkMobilePhone,
  findEmailByNameAndMobilePhone,
  generatePasswordResetVerification,
  checkUserHasLinkedProvider,
  findUserByEmail,
  verifyPasswordResetValue,
  updateUserPassword,
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

export async function FindUserEmail(params: {
  name: string;
  mobilePhone: string;
}) {
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
    message: "이메일이 발송되었습니다.\n이메일을 확인해주세요.",
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

    // 비밀번호 초기화 이메일 발송
    await sendPasswordResetMail(email, verifyValue);
  } catch (e: any) {
    response.ok = false;
    response.message = e.message;
  } finally {
    return response;
  }
}

/**
 * 비밀번호 초기화 인증값 확인
 * @param value
 * @param sendMethod
 * @returns
 */
export async function VerifyPasswordResetValue(
  value: string,
  sendMethod: SendMethod,
) {
  const response: AuthActionResponse = {
    ok: true,
    message: "인증되었습니다.",
  };
  try {
    if (!value) throw new Error("인증이 유효하지 않습니다.");
    // 값 유요한지 확인
    const verification: string = await verifyPasswordResetValue(
      value,
      sendMethod,
    );
    response.data = { verification };
  } catch (e: any) {
    response.ok = false;
    response.message = e.message;
  } finally {
    return response;
  }
}

/**
 * 비밀번호 초기화
 * @param userId
 * @param newPassword
 * @param sendMethod
 * @returns
 */
export async function ResetNewPassword(
  userId: string,
  newPassword: string,
  sendMethod: SendMethod,
) {
  const response: AuthActionResponse = {
    ok: true,
    message: "비밀번호가 변경되었습니다.",
  };
  try {
    // 비밀번호 업데이트
    await updateUserPassword(userId, newPassword, sendMethod);
  } catch (e: any) {
    response.ok = false;
    response.message = e.message;
  } finally {
    return response;
  }
}
