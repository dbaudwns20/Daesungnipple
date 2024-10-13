import { Provider, SendMethod } from "@/types";

import { EMAIL_RULE, PASSWORD_RULE, PHONE_RULE } from "@/utils/validator";
import { comparePassword, encryptPassword } from "@/utils/password";
import { generateRandomText, maskingValue } from "@/utils/common";

import { prisma } from "@/prisma";
import { PasswordUpdateLog, User } from "@prisma/client";

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
export async function getAuthUser(email: string, password: string) {
  await checkEmail(email, "NONE");
  if (!PASSWORD_RULE.test(password))
    throw new Error(
      "비밀번호는 영문자, 숫자, 특수문자를 포함 최소 8~20자로 입력해주세요",
    );

  const user: any = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // 사용자가 없거나 비밀번호가 일치하지 않으면
  if (!user || !comparePassword(password, user.password))
    throw new Error("이메일 또는 비밀번호를 확인해주세요.");

  // password 제거
  delete user.password;

  return user;
}

/**
 * 입력된 이메일로 유저가 존재하는지 확인
 * @param email
 * @returns
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findFirst({ where: { email } });
}

/**
 * OAuth 로그인 이용자가 기본 회원가입 되어있는지 체크
 * @param userId
 * @param provider
 * @returns
 */
export async function checkUserHasLinkedProvider(
  userId: string,
  provider?: Provider,
): Promise<boolean> {
  let whereQuery: any = {
    userId,
  };
  if (provider) {
    whereQuery = {
      ...whereQuery,
      ...{ provider },
    };
  }
  return (await prisma.linkedProvider.findFirst({ where: whereQuery })) != null;
}

/**
 * Check 기능 유형
 */
type CheckType = "EXIST" | "NOT_EXIST" | "NONE";

/**
 * 동일 이메일 체크 및 형식 확인
 * @param email
 * @param checkType
 */
export async function checkEmail(
  email: string | null,
  checkType: CheckType,
): Promise<void> {
  if (!email) throw new Error("이메일을 입력해주세요.");
  if (!EMAIL_RULE.test(email))
    throw new Error("올바른 이메일 형식이 아닙니다.");
  if (checkType != "NONE") {
    if (checkType === "EXIST" && (await findUserByEmail(email)))
      throw new Error("이미 가입된 이메일입니다.");
    if (checkType === "NOT_EXIST" && !(await findUserByEmail(email)))
      throw new Error("가입되지 않은 이메일입니다.");
  }
}

/**
 * 동일 전화번호 체크 및 형식 확인
 * @param mobilePhone
 * @param checkType
 */
export async function checkMobilePhone(
  mobilePhone: string | null,
  checkType: CheckType = "NONE",
): Promise<void> {
  if (!mobilePhone) throw new Error("전화번호를 입력해주세요.");
  if (!PHONE_RULE.test(mobilePhone))
    throw new Error("올바른 전화번호 형식이 아닙니다.");
  if (checkType != "NONE") {
    if (
      checkType === "EXIST" &&
      (await prisma.user.findFirst({
        where: { mobilePhone },
      }))
    ) {
      throw new Error("이미 가입된 전화번호입니다.");
    }
    if (
      checkType === "NOT_EXIST" &&
      !(await prisma.user.findFirst({
        where: { mobilePhone },
      }))
    ) {
      throw new Error("가입되지 않은 전화번호입니다.");
    }
  }
}

/**
 * 유저 생성
 * @param body
 */
export async function createUser(formData: FormData): Promise<void> {
  await checkEmail(formData.get("email") as string, "EXIST");
  await checkMobilePhone(formData.get("mobilePhone") as string, "EXIST");

  const name: string = formData.get("name") as string;
  const email: string = formData.get("email") as string;
  const password: string =
    (formData.get("password") as string) ?? generateRandomText();
  const mobilePhone: string = formData.get("mobilePhone") as string;
  const image: string | null = (formData.get("image") as string) ?? null;
  const provider: string | null = (formData.get("provider") as string) ?? null;

  const encryptedPassword: string = encryptPassword(password);

  // 트랜잭션을 사용하여 데이터베이스 작업을 묶음 처리
  await prisma.$transaction(async (prisma) => {
    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
        mobilePhone,
        image,
      },
    });

    // 계정 연동이 있으면 linkedProvider 테이블에 기록
    if (provider) {
      const currentProvider: Provider = provider as Provider;

      if (!currentProvider) throw new Error("유효하지 않은 계정 연동입니다.");

      await prisma.linkedProvider.create({
        data: {
          userId: user.id,
          provider: currentProvider,
        },
      });
    } else {
      // 비밀번호 변경 로그 기록 (연동이 아닌 경우에만 생성)
      await prisma.passwordUpdateLog.create({
        data: {
          userId: user.id,
          password: encryptedPassword,
        },
      });
    }
  });
}

/**
 * 이름과 전화번호로 사용자 조회
 * @param name
 * @param mobilePhone
 * @returns
 */
export async function findEmailByNameAndMobilePhone(
  name: string,
  mobilePhone: string,
): Promise<{
  email: string;
  hasProvider: boolean;
}> {
  // 이름과 전화번호로 이메일, 아이디 찾기
  const userInfo = await prisma.user.findFirst({
    select: { id: true, email: true },
    where: { name, mobilePhone },
  });
  if (!userInfo) throw new Error("이름 또는 전화번호를 확인해주세요.");
  let [head, email]: string[] = userInfo.email.split("@");
  return {
    email: maskingValue(head, false, 50) + "@" + email, // 마스킹 뒤에서 50%
    hasProvider: await checkUserHasLinkedProvider(userInfo.id), // OAuth 로그인 연동 되어있는지 확인
  };
}

/**
 * 이메일 인증 값 생성 or 갱신
 * @param email
 * @returns
 */
export async function generatePasswordResetVerification(
  email: string,
  sendMethod: SendMethod,
): Promise<string> {
  // 사용자 정보
  const user = await findUserByEmail(email);
  // 현재 시간
  const currentTime: number = new Date().getTime();
  // 인증 값 (난수 64자)
  const value: string = generateRandomText(64);

  await prisma.$transaction(async (prisma) => {
    await prisma.passwordResetVerification.upsert({
      where: {
        userId_sendMethod: {
          userId: user!.id,
          sendMethod,
        },
      },
      update: {
        value,
        createdAt: new Date(currentTime),
        expiredAt: new Date(currentTime + 60 * 60 * 1000), // 1시간
      },
      create: {
        userId: user!.id,
        sendMethod,
        value,
        createdAt: new Date(currentTime),
        expiredAt: new Date(currentTime + 60 * 60 * 1000), // 1시간
      },
    });
  });

  return value;
}

export async function verifyPasswordResetValue(
  value: string,
  sendMethod: SendMethod,
): Promise<string> {
  const verify = await prisma.passwordResetVerification.findFirst({
    where: { value, sendMethod },
  });

  if (!verify) throw new Error("인증이 유효하지 않습니다.");

  if (verify.expiredAt < new Date()) {
    // 인증 값 지우기
    await prisma.$transaction(async (prisma) => {
      await prisma.passwordResetVerification.delete({
        where: {
          userId_sendMethod: { userId: verify.userId, sendMethod: sendMethod },
        },
      });
    });
    throw new Error(
      "인증시간이 만료되었습니다.\n비밀번호 초기화 인증을 다시 시도해주세요.",
    );
  }

  return verify.userId;
}

export async function updateUserPassword(
  userId: string, // Auth Session으로 현재 로그인 상태인지 확인 필요
  newPassword: string,
  sendMethod?: SendMethod,
) {
  if (!PASSWORD_RULE.test(newPassword))
    throw new Error(
      "비밀번호는 영문자, 숫자, 특수문자를 포함 최소 8~20자로 입력해주세요",
    );

  // 사용자 조회
  const user = await prisma.user.findFirst({ where: { id: userId } });
  if (!user) throw new Error("계정 정보를 찾을 수 없습니다.");

  let passwordUpdateLogs: PasswordUpdateLog[] =
    await prisma.passwordUpdateLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

  let garbageLogIds: number[] = [];

  // 로그의 갯수가 4개 이상 인 경우
  while (passwordUpdateLogs.length > 3) {
    let log: PasswordUpdateLog = passwordUpdateLogs.pop()!;
    garbageLogIds.push(log.id);
  }

  // 이전 비밀번호와 비교
  passwordUpdateLogs.forEach((it: PasswordUpdateLog) => {
    if (comparePassword(newPassword, it.password)) {
      throw new Error("최근 사용했던 비밀번호는 사용할 수 없습니다.");
    }
  });

  const encryptedPassword: string = encryptPassword(newPassword);

  prisma.$transaction(async (prisma) => {
    await prisma.user.update({
      where: { id: userId },
      data: { password: encryptedPassword },
    });

    // 가비지 데이터 처리
    if (garbageLogIds.length > 0)
      await prisma.passwordUpdateLog.deleteMany({
        where: { id: { in: garbageLogIds } },
      });

    // 비밀번호 변경 로그 생성
    await prisma.passwordUpdateLog.create({
      data: {
        userId: user.id,
        password: encryptedPassword,
      },
    });

    // 발송 방식이 있다면 인증 데이터 제거
    if (sendMethod) {
      await prisma.passwordResetVerification.delete({
        where: { userId_sendMethod: { userId, sendMethod } },
      });
    }
  });
}
