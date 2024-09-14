export enum Provider {
  GOOGLE = "GOOGLE",
  KAKAO = "KAKAO",
  NAVER = "NAVER",
}

export function getValue(provider: string) {
  return Provider[provider as keyof typeof Provider];
}
