import { prisma } from "@/prisma";
import { Provider } from "@/types/provider";

import { encryptPassword } from "@/utils/password";
import { generateRandomText } from "@/utils/common";
import { EMAIL_RULE, PHONE_RULE } from "@/utils/validator";

/**
 * 동일 이메일 체크 및 형식 확인
 * @param email
 */
async function checkEmail(email: string | null) {
  if (!email) throw new Error("이메일이 존재하지 않습니다.");
  if (!EMAIL_RULE.test(email))
    throw new Error("올바른 이메일 형식이 아닙니다.");
  const sameEmailCnt: number = await prisma.user.count({ where: { email } });
  if (sameEmailCnt > 0) throw new Error("이미 가입된 이메일입니다");
}

/**
 * 동일 전화번호 체크 및 형식 확인
 * @param mobilePhone
 */
async function checkMobilePhone(mobilePhone: string | null) {
  if (!mobilePhone) throw new Error("전화번호가 존재하지 않습니다.");
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
export async function createUser(formData: FormData) {
  try {
    await checkEmail(formData.get("email") as string);
    await checkMobilePhone(formData.get("mobilePhone") as string);

    const name: string = formData.get("name") as string;
    const email: string = formData.get("email") as string;
    const password: string =
      (formData.get("password") as string) ?? generateRandomText();
    const mobilePhone: string = formData.get("mobilePhone") as string;
    const image: string | null = (formData.get("image") as string) ?? null;
    const provider: string | null =
      (formData.get("provider") as string) ?? null;

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

      // 2. 계정 연동이 있으면 accountProvider 테이블에 기록
      if (provider) {
        const currentProvider: Provider =
          Provider[provider as keyof typeof Provider];

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
