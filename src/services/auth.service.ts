import { prisma } from "@/prisma";

import { Provider, getValue } from "@/types/provider";

import { EMAIL_RULE, PASSWORD_RULE, PHONE_RULE } from "@/utils/validator";
import { comparePassword, encryptPassword } from "@/utils/password";
import { generateRandomText, maskingValue } from "@/utils/common";

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
export async function findUserByEmail(email: string) {
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
    userId,
  };
  if (provider) {
    whereQuery = {
      ...whereQuery,
      ...{ provider: getValue(provider.toUpperCase()) },
    };
  }
  return (await prisma.linkedProvider.findFirst({ where: whereQuery })) != null;
}

/**
 * 동일 이메일 체크 및 형식 확인
 * @param email
 * @param isSignUp
 */
export async function checkEmail(
  email: string | null,
  isSignUp: boolean = false,
) {
  if (!email) throw new Error("이메일을 입력해주세요");
  if (!EMAIL_RULE.test(email))
    throw new Error("올바른 이메일 형식이 아닙니다.");
  if (isSignUp && (await findUserByEmail(email)))
    throw new Error("이미 가입되거나 소셜 로그인에 연동된 이메일입니다");
}

/**
 * 동일 전화번호 체크 및 형식 확인
 * @param mobilePhone
 * @param isSignUp
 */
export async function checkMobilePhone(
  mobilePhone: string | null,
  isSignUp: boolean = false,
) {
  if (!mobilePhone) throw new Error("전화번호를 입력해주세요");
  if (!PHONE_RULE.test(mobilePhone))
    throw new Error("올바른 전화번호 형식이 아닙니다");
  if (
    isSignUp &&
    (await prisma.user.findFirst({
      where: { mobilePhone },
    }))
  )
    throw new Error("이미 가입된 전화번호입니다");
}

/**
 * 유저 생성
 * @param body
 */
export async function createUser(formData: FormData) {
  await checkEmail(formData.get("email") as string, true);
  await checkMobilePhone(formData.get("mobilePhone") as string, true);

  const name: string = formData.get("name") as string;
  const email: string = formData.get("email") as string;
  const password: string =
    (formData.get("password") as string) ?? generateRandomText();
  const mobilePhone: string = formData.get("mobilePhone") as string;
  const image: string | null = (formData.get("image") as string) ?? null;
  const provider: string | null = (formData.get("provider") as string) ?? null;

  // 트랜잭션을 사용하여 데이터베이스 작업을 묶음 처리
  await prisma.$transaction(async (prisma) => {
    // 1. 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptPassword(password),
        mobilePhone,
        image,
      },
    });

    // 2. 계정 연동이 있으면 linkedProvider 테이블에 기록
    if (provider) {
      const currentProvider: Provider = getValue(provider);

      if (!currentProvider) throw new Error("유효하지 않은 계정 연동입니다");

      await prisma.linkedProvider.create({
        data: {
          userId: user.id,
          provider: currentProvider,
        },
      });
    }
  });
}

export async function findEmailByNameAndMobilePhone(
  name: string,
  mobilePhone: string,
): Promise<{
  email: string;
  hasProvider: boolean;
}> {
  // 이름과 전화번호로 이메일, 아이디 찾기
  const res = await prisma.user.findFirst({
    select: { id: true, email: true },
    where: { name, mobilePhone },
  });
  if (!res) throw new Error("이름 또는 전화번호를 확인해주세요");
  let [head, email]: string[] = res.email.split("@");
  return {
    email: maskingValue(head, false, 50) + "@" + email, // 마스킹 뒤에서 50%
    hasProvider: await checkUserHasLinkedProvider(res.id), // OAuth 로그인 연동 되어있는지 확인
  };
}
