/**
 * 결과 타입
 */
export enum ResultType {
  RESULT_NONE = "RESULT_NONE",
  RESULT_SINGLE = "RESULT_SINGLE",
  RESULT_LIST = "RESULT_LIST",
}

/**
 * 공통 결과
 */
export type CommonResult<T> = {
  message: string;
  resultType: ResultType;
  data: T | ListResult<T> | null;
};

/**
 * 결과 없음
 * @param message
 */
export function makeNoneResult<T>(message: string = ""): CommonResult<T> {
  return {
    message: message,
    resultType: ResultType.RESULT_NONE,
    data: null,
  };
}

/**
 * 에러 결과
 * @param message
 */
export function makeErrorResult<T>(message: string): CommonResult<T> {
  return {
    message: message,
    resultType: ResultType.RESULT_NONE,
    data: null,
  };
}

/**
 * 단일 조회 결과
 * @param data
 * @param message
 */
export function makeSingleResult<T>(
  data: any,
  message: string = "",
): CommonResult<T> {
  return {
    message: message,
    resultType: ResultType.RESULT_SINGLE,
    data: data,
  };
}

/**
 * 리스트 조회 결과
 */
export type ListResult<T> = {
  list: T[];
  totalCount: number;
};

/**
 * 리스트 조회 결과 만들기
 * @param message
 * @param list
 * @param totalCount
 * @returns ListResult
 */
export function makeListResult<T>(
  list: T[],
  totalCount: number,
  message: string = "",
): CommonResult<T> {
  return {
    message: message,
    resultType: ResultType.RESULT_LIST,
    data: { list, totalCount } as ListResult<T>,
  };
}
