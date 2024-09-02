import { prisma } from "@/prisma";
import { Provider } from "@/types/provider";

import { encryptPassword } from "@/utils/password";
import { EMAIL_RULE, PHONE_RULE } from "@/utils/validator";

type RequestBody = {
  name: string;
  email: string;
  password: string;
  mobilePhone: string;
  provider?: Provider;
};

/**
 * 동일 이메일 체크 및 형식 확인
 * @param email
 */
async function checkEmail(email: string) {
  if (!EMAIL_RULE.test(email))
    throw new Error("올바른 이메일 형식이 아닙니다.");
  const sameEmailCnt: number = await prisma.user.count({ where: { email } });
  if (sameEmailCnt > 0) throw new Error("이미 가입된 이메일입니다");
}

/**
 * 동일 전화번호 체크 및 형식 확인
 * @param mobilePhone
 */
async function checkMobilePhone(mobilePhone: string) {
  if (!PHONE_RULE.test(mobilePhone))
    throw new Error("올바른 전화번호 형식이 아닙니다.");
  const sameMobilePhoneCnt: number = await prisma.user.count({
    where: { mobilePhone },
  });
  if (sameMobilePhoneCnt > 0) throw new Error("이미 가입된 전화번호입니다");
}

/**
 * 유저 생성
 * @param body
 */
export async function createUser(body: RequestBody) {
  try {
    await checkEmail(body.email);
    await checkMobilePhone(body.mobilePhone);

    const { name, email, password, mobilePhone, provider = "" } = body;

    // 트랜잭션을 사용하여 데이터베이스 작업을 묶음 처리
    await prisma.$transaction(async (prisma) => {
      // 1. 사용자 생성
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: encryptPassword(password),
          mobilePhone,
        },
      });

      // 2. 계정 연동이 있으면 accountProvider 테이블에 기록
      if (provider) {
        const currentProvider: Provider = Provider[provider];

        if (!currentProvider) throw new Error("유효하지 않은 계정 연동입니다.");

        await prisma.accountProvider.create({
          data: {
            userId: user.id,
            provider: currentProvider,
          },
        });
      }
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}
