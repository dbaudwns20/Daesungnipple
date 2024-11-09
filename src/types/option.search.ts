export enum StringMatchType {
  STRING_EXACT = "STRING_EXACT", // 정확히 일치 "= value"
  STRING_NOT_EXACT = "STRING_NOT_EXACT", // 정확히 일치하지 않음 "!= value"
  STRING_CONTAINS = "STRING_CONTAINS", // 포함 "LIKE %value%"
  STRING_NOT_CONTAINS = "STRING_NOT_CONTAINS", // 포함하지 않음 "NOT LIKE %value%"
  STRING_STARTS_WITH = "STRING_STARTS_WITH", // 시작 "value%"
  STRING_NOT_STARTS_WITH = "STRING_NOT_STARTS_WITH", // 시작하지 않음 "NOT LIKE value%"
  STRING_ENDS_WITH = "STRING_ENDS_WITH", // 끝 "%value"
  STRING_NOT_ENDS_WITH = "STRING_NOT_ENDS_WITH", // 끝나지 않음 "NOT LIKE %value"
}

export type StringSearchOption = {
  value: string;
  matchType: StringMatchType;
}

export enum NumberExactMatchType {
  NUMBER_EXACT = "NUMBER_EXACT", // 정확히 일치 "= value"
  NUMBER_NOT_EXACT = "NUMBER_NOT_EXACT", // 정확히 일치하지 않음 "!= value"
}

export type NumberExactSearchOption = {
  value: number;
  matchType: NumberExactMatchType;
}

export enum NumberRangeMatchType {
  NUMBER_GT = "NUMBER_GT", // 초과 "> value"
  NUMBER_GTE = "NUMBER_GTE", // 이상 ">= value"
  NUMBER_LT = "NUMBER_LT", // 미만 "< value"
  NUMBER_LTE = "NUMBER_LTE", // 이하 "<= value"
}

export type NumberRangeSearchOption = {
  startValue: number | null; // 시작 값, null 이면 무제한
  startMatchType: NumberRangeMatchType;
  endValue: number | null; // 끝 값, null 이면 무제한
  endMatchType: NumberRangeMatchType;
}

// /**
//  * 삭제된 데이터를 포함한 조회 옵션
//  * - NONE: 조회 옵션 없음 => ALL
//  * - ALL: 모두 조회
//  * - ALIVE: 삭제되지 않은 것만 조회
//  * - ALIVE_ACTIVE: 삭제되지 않은 노출된 것만 조회
//  * - ALIVE_INACTIVE: 삭제되지 않은 숨김된 것만 조회
//  * - DELETED: 삭제된 것만 조회
//  */
// export enum SearchOption {
//   NONE = "NONE", // 조회 옵션 없음 => ALL
//   ALL = "ALL", // 조건 없이 모두 조회
//   ALIVE = "ALIVE", // 삭제되지 않은 것만 조회 { deletedAt: null }
//   ALIVE_ACTIVE = "ALIVE_ACTIVE", // 삭제되지 않은 노출된 것만 조회 { deletedAt: null, exposedAt: { not: null } }
//   ALIVE_INACTIVE = "ALIVE_INACTIVE", // 삭제되지 않은 숨김된 것만 조회 { deletedAt: null, exposedAt: null }
//   DELETED = "DELETED" // 삭제된 것만 조회 { deletedAt: { not: null } }
// }
//
// /**
//  * 삭제된 데이터를 포함한 조회 옵션을 Prisma 검색 조건으로 변환
//  * @param id, 검색할 ID
//  * - NONE: 조회 옵션 없음 => ALL
//  * - ALL: 모두 조회 => {}
//  * - ALIVE: 삭제되지 않은 것만 조회 => { deletedAt: null }
//  * - ALIVE_ACTIVE: 삭제되지 않은 노출된 것만 조회 => { deletedAt: null, exposedAt: { not: null } }
//  * - ALIVE_INACTIVE: 삭제되지 않은 숨김된 것만 조회 => { deletedAt: null, exposedAt: null }
//  * - DELETED: 삭제된 것만 조회 => { deletedAt: { not: null } }
//  * @param opt
//  */
// export function getSearchOptionAsCondition(id: string, opt: SearchOption): any {
//   switch (opt) {
//     case SearchOption.ALL:
//       return { id: id };
//     case SearchOption.ALIVE:
//       return { AND: [ { id: id }, { deletedAt: null } ] };
//     case SearchOption.ALIVE_ACTIVE:
//       return { AND: [ { id: id }, { deletedAt: null }, { exposedAt: { not: null } } ] };
//     case SearchOption.ALIVE_INACTIVE:
//       return { AND: [ { id: id }, { deletedAt: null }, { exposedAt: null } ] };
//     case SearchOption.DELETED:
//       return { AND: [ { id: id }, { deletedAt: { not: null } } ] };
//   }
// }
//
// /**
//  * 삭제 여부 등을 포함한 검색 옵션 검증
//  * @param opt
//  * @returns SearchOption
//  */
// export function validateSearchOption(opt: SearchOption | undefined): SearchOption {
//   if (!opt ||
//     (opt !== SearchOption.ALL &&
//       opt !== SearchOption.ALIVE &&
//       opt !== SearchOption.ALIVE_ACTIVE &&
//       opt !== SearchOption.ALIVE_INACTIVE &&
//       opt !== SearchOption.DELETED)) return SearchOption.ALL;
//   return opt;
// }
