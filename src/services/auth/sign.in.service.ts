import { prisma } from "@/prisma";

import { getValue } from "@/types/provider";

import { EMAIL_RULE, PASSWORD_RULE } from "@/utils/validator";
import { comparePassword } from "@/utils/password";

type SignInRequest = {
  email: string;
  password: string;
};

const INVALID_EMAIL_MESSAGE: string = "이메일 형식이 유효하지 않습니다";
const INVALID_PASSWORD_MESSAGE: string =
  "비밀번호는 영문자, 숫자, 특수문자를 포함 최소 8~20자로 입력해주세요";
const SIGN_IN_MESSAGE: string = "이메일 또는 비밀번호를 확인해주세요";

/**
 * 로그인 기록 생성
 */
async function generateLoginAccessLog() {
  // TODO
}

/**
 * 로그인 이용자 확인
 * @param params
 * @returns
 */
export async function getAuthUser(params: SignInRequest) {
  const { email, password } = params;

  if (!EMAIL_RULE.test(email)) throw new Error(INVALID_EMAIL_MESSAGE);
  if (!PASSWORD_RULE.test(password)) throw new Error(INVALID_PASSWORD_MESSAGE);

  let user: any = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // 사용자가 없거나 비밀번호가 일치하지 않으면
  if (!user || !comparePassword(password, user.password))
    throw new Error(SIGN_IN_MESSAGE);

  // password 제거
  delete user.password;

  return user;
}

/**
 * 입력된 이메일로 유저가 존재하는지 확인
 * @param email
 * @returns
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findFirst({ where: { email } });
}

/**
 * OAuth 로그인 이용자가 기본 회원가입 되어있는지 체크
 * @param userId
 * @param provider
 * @returns
 */
export async function checkUserHasLinkedProvider(
  userId: number,
  provider?: string,
): Promise<boolean> {
  let whereQuery: any = {
    where: {
      userId,
    },
  };
  if (provider) {
    whereQuery = {
      ...whereQuery,
      ...{ where: { provider: getValue(provider.toUpperCase()) } },
    };
  }
  return (await prisma.linkedProvider.findFirst(whereQuery)) != null;
}
