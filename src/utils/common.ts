/**
 * 난수 문자열 생성
 * @returns
 */
export function generateRandomText(length: number = 8): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result: string = "";
  for (let i = 0; i < length; i++) {
    const randomIndex: number = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

/**
 * 파일 용량 변환
 * @param size
 * @returns
 */
export function convertFileSizeToString(size: number): string {
  const sizeInKb: number = size / 1024;
  if (sizeInKb > 1024) {
    return (sizeInKb / 1024).toFixed(2) + "MB";
  } else {
    return sizeInKb.toFixed(2) + "KB";
  }
}

/**
 * 문자열 마스킹
 * @param value
 * @param isFromTail true: 앞에서 false: 뒤에서
 * @param percent 마스킹 비율
 * @returns
 */
export function maskingValue(
  value: string,
  isFromTail: boolean = false,
  percent: number = 50,
): string {
  const index: number = Math.floor(value.length * (percent / 100));
  if (isFromTail) {
    return "*".repeat(index) + value.substring(index);
  } else {
    return value.substring(0, value.length - index) + "*".repeat(index);
  }
}
