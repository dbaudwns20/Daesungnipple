import { SearchOption, validateSearchOption } from "@/types";

/**
 * 리스트 조회 옵션
 * @property {number} page - 페이지
 * @property {number} unit - 한 페이지에 보여줄 개수
 * @property {SearchOption} searchOption - 삭제된 데이터를 포함한 조회 옵션
 */
export type ListOption = {
  page: number; // offset = (page - 1) * limit
  unit: number; // limit
  searchOption: SearchOption; // 삭제된 데이터를 포함한 조회 옵션
  // orderBy: string // 정렬 기준
  // orderDirection: string // 정렬 방향
}

/**
 * 리스트 조회 옵션 검증
 * - 페이지 설정 안되어 있으면 1
 * - 한 페이지에 보여줄 개수 설정 안되어 있으면 20
 * - 조회 옵션 설정 안되어 있으면 ALL
 * @param opt
 * @returns T
 */
export function validateListOption<T>(opt: Partial<ListOption>): T {
  // 페이지 설정 안되어 있으면 1
  if (!opt.page || opt.page < 1) opt.page = 1;
  // 한 페이지에 보여줄 개수 설정 안되어 있으면 20
  if (!opt.unit || opt.unit < 1) opt.unit = 20;
  // 조회 옵션 설정 안되어 있으면 ALL
  opt.searchOption = validateSearchOption(opt.searchOption);

  // if (!opt.orderBy || opt.orderBy === "") opt.orderBy = "created_at";
  // if (!opt.orderDirection || (opt.orderDirection !== "ASC" && opt.orderDirection !== "DESC"))
  //   opt.orderDirection = "DESC";
  return opt as T;
}

/**
 * 리스트 조회 결과
 */
export type ListResult = {
  list: any[];
  totalCount: number;
}