/**
 * 삭제된 데이터를 포함한 조회 옵션
 * - NONE: 조회 옵션 없음 => ALL
 * - ALL: 모두 조회
 * - ALIVE: 삭제되지 않은 것만 조회
 * - ALIVE_ACTIVE: 삭제되지 않은 노출된 것만 조회
 * - ALIVE_INACTIVE: 삭제되지 않은 숨김된 것만 조회
 * - DELETED: 삭제된 것만 조회
 */
export enum SearchOption {
  NONE = "NONE", // 조회 옵션 없음 => ALL
  ALL = "ALL", // 조건 없이 모두 조회
  ALIVE = "ALIVE", // 삭제되지 않은 것만 조회 { deletedAt: null }
  ALIVE_ACTIVE = "ALIVE_ACTIVE", // 삭제되지 않은 노출된 것만 조회 { deletedAt: null, exposedAt: { not: null } }
  ALIVE_INACTIVE = "ALIVE_INACTIVE", // 삭제되지 않은 숨김된 것만 조회 { deletedAt: null, exposedAt: null }
  DELETED = "DELETED" // 삭제된 것만 조회 { deletedAt: { not: null } }
}

/**
 * 삭제된 데이터를 포함한 조회 옵션을 Prisma 검색 조건으로 변환
 * @param id, 검색할 ID
 * - NONE: 조회 옵션 없음 => ALL
 * - ALL: 모두 조회 => {}
 * - ALIVE: 삭제되지 않은 것만 조회 => { deletedAt: null }
 * - ALIVE_ACTIVE: 삭제되지 않은 노출된 것만 조회 => { deletedAt: null, exposedAt: { not: null } }
 * - ALIVE_INACTIVE: 삭제되지 않은 숨김된 것만 조회 => { deletedAt: null, exposedAt: null }
 * - DELETED: 삭제된 것만 조회 => { deletedAt: { not: null } }
 * @param opt
 */
export function getSearchOptionAsCondition(id: string, opt: SearchOption): any {
  switch (opt) {
    case SearchOption.ALL:
      return { id: id };
    case SearchOption.ALIVE:
      return { AND: [ { id: id }, { deletedAt: null } ] };
    case SearchOption.ALIVE_ACTIVE:
      return { AND: [ { id: id }, { deletedAt: null }, { exposedAt: { not: null } } ] };
    case SearchOption.ALIVE_INACTIVE:
      return { AND: [ { id: id }, { deletedAt: null }, { exposedAt: null } ] };
    case SearchOption.DELETED:
      return { AND: [ { id: id }, { deletedAt: { not: null } } ] };
  }
}

/**
 * 삭제 여부 등을 포함한 검색 옵션 검증
 * @param opt
 * @returns SearchOption
 */
export function validateSearchOption(opt: SearchOption | undefined): SearchOption {
  if (!opt ||
    (opt !== SearchOption.ALL &&
      opt !== SearchOption.ALIVE &&
      opt !== SearchOption.ALIVE_ACTIVE &&
      opt !== SearchOption.ALIVE_INACTIVE &&
      opt !== SearchOption.DELETED)) return SearchOption.ALL;
  return opt;
}
