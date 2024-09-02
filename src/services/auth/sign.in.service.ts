import { prisma } from "@/prisma";
import { AccessDenied } from "@auth/core/errors";

import { EMAIL_RULE, PASSWORD_RULE } from "@/utils/validator";
import { comparePassword } from "@/utils/password";

type SignInRequest = {
  email: string;
  password: string;
};

const INVALID_EMAIL_MESSAGE: string = "이메일 형식이 유효하지 않습니다";
const INVALID_PASSWORD_MESSAGE: string =
  "비밀번호는 영문자, 숫자, 특수문자를 포함 최소 8~20자로 입력해주세요";
const SIGN_IN_MESSAGE: string = "이메일 또는 비밀번호가 일치하지 않습니다";

/**
 * 로그인 이용자 확인
 * @param params
 * @returns
 */
export async function getAuthUser(params: SignInRequest) {
  const { email, password } = params;

  if (!EMAIL_RULE.test(email)) throw new AccessDenied(INVALID_EMAIL_MESSAGE);
  if (!PASSWORD_RULE.test(password))
    throw new AccessDenied(INVALID_PASSWORD_MESSAGE);

  let user: any = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // 사용자가 없다면
  if (!user) throw new AccessDenied(SIGN_IN_MESSAGE);

  return comparePassword(password, user.password) ? user : null;
}

/**
 * 입력된 이메일로 유저가 존재하는지 확인
 * @param email
 * @returns
 */
export async function checkUserExist(email: string): Promise<boolean> {
  return (await prisma.user.count({ where: { email } })) === 0;
}
