import { prisma } from "@/prisma";

import { encryptPassword } from "@/utils/password";
import { EMAIL_RULE, PHONE_RULE } from "@/utils/validator";

type RequestBody = {
  name: string;
  email: string;
  password: string;
  mobilePhone: string;
};

async function checkEmail(email: string) {
  if (!EMAIL_RULE.test(email))
    throw new Error("올바른 이메일 형식이 아닙니다.");
  const sameEmailCnt: number = await prisma.user.count({ where: { email } });
  if (sameEmailCnt > 0) throw new Error("이미 가입된 이메일입니다");
}

async function checkMobilePhone(mobilePhone: string) {
  if (!PHONE_RULE.test(mobilePhone))
    throw new Error("올바른 전화번호 형식이 아닙니다.");
  const sameMobilePhoneCnt: number = await prisma.user.count({
    where: { mobilePhone },
  });
  if (sameMobilePhoneCnt > 0) throw new Error("이미 가입된 전화번호입니다");
}

export async function createUser(body: RequestBody) {
  try {
    await checkEmail(body.email);
    await checkMobilePhone(body.mobilePhone);

    const { name, email, password, mobilePhone } = body;

    await prisma.user.create({
      data: {
        name,
        email,
        password: encryptPassword(password),
        mobilePhone,
      },
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}
