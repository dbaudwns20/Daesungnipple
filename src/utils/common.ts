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

/**
 * 숫자를 3자리 단위로 콤마(,)를 찍어서 반환
 * @param num
 */
export function addComma(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * 숫자를 한글로 변환
 * @param num
 * @returns string
 */
export function numberToKorean(num: number): string {
  const units = ["", "만", "억", "조", "경"];
  const smallUnits = ["", "십", "백", "천"];
  const numbers = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];

  if (num === 0) return "영";

  let result = "";
  let unitIndex = 0;

  while (num > 0) {
    const part = num % 10000;
    if (part > 0) {
      let partStr = "";
      for (let i = 0; i < 4; i++) {
        const digit = Math.floor(part / Math.pow(10, i)) % 10;
        if (digit > 0) {
          partStr = numbers[digit] + smallUnits[i] + partStr;
        }
      }
      result = partStr + units[unitIndex] + result;
    }
    num = Math.floor(num / 10000);
    unitIndex++;
  }

  return result;
}
