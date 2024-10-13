/**
 * 삭제된 데이터를 포함한 조회 옵션
 * - NONE: 조회 옵션 없음 => ALIVE
 * - ALL: 모두 조회
 * - ALIVE: 삭제되지 않은 것만 조회
 * - DELETED: 삭제된 것만 조회
 */
export enum ListAliveOption {
  NONE = "NONE", // 조회 옵션 없음 => ALIVE
  ALL = "ALL", // 모두 조회
  ALIVE = "ALIVE", // 삭제되지 않은 것만 조회
  DELETED = "DELETED" // 삭제된 것만 조회
}

/**
 * 삭제된 데이터를 포함한 조회 옵션을 Prisma 검색 조건으로 변환
 * - NONE: 조회 옵션 없음 => ALIVE
 * - ALL: 모두 조회 => {}
 * - ALIVE: 삭제되지 않은 것만 조회 => { deletedAt: null }
 * - DELETED: 삭제된 것만 조회 => { deletedAt: { not: null } }
 * @param opt
 */
export function getListAliveOptionAsCondition(opt: ListAliveOption): any {
  switch (opt) {
    case ListAliveOption.ALL:
      return {};
    case ListAliveOption.ALIVE:
      return { deletedAt: null };
    case ListAliveOption.DELETED:
      return { deletedAt: { not: null } };
    default:
      return { deletedAt: null };
  }
}

/**
 * 리스트 조회 옵션
 * @property {number} page - 페이지
 * @property {number} unit - 한 페이지에 보여줄 개수
 * @property {ListAliveOption} listAliveOption - 삭제된 데이터를 포함한 조회 옵션
 */
export type ListOption = {
  page: number; // offset = (page - 1) * limit
  unit: number; // limit
  listAliveOption: ListAliveOption; // 삭제된 데이터를 포함한 조회 옵션
  // orderBy: string // 정렬 기준
  // orderDirection: string // 정렬 방향
}

/**
 * 리스트 조회 옵션 검증
 * - 페이지 설정 안되어 있으면 1
 * - 한 페이지에 보여줄 개수 설정 안되어 있으면 20
 * - 조회 옵션 설정 안되어 있으면 ALIVE
 * @param opt
 * @returns T
 */
export function validateListOption<T>(opt: Partial<ListOption>): T {
  // 페이지 설정 안되어 있으면 1
  if (!opt.page || opt.page < 1) opt.page = 1;
  // 한 페이지에 보여줄 개수 설정 안되어 있으면 20
  if (!opt.unit || opt.unit < 1) opt.unit = 20;
  // 조회 옵션 설정 안되어 있으면 ALIVE
  if (!opt.listAliveOption ||
    (opt.listAliveOption !== ListAliveOption.ALL &&
      opt.listAliveOption !== ListAliveOption.ALIVE &&
      opt.listAliveOption !== ListAliveOption.DELETED)) opt.listAliveOption = ListAliveOption.ALIVE;
  // if (!opt.orderBy || opt.orderBy === "") opt.orderBy = "created_at";
  // if (!opt.orderDirection || (opt.orderDirection !== "ASC" && opt.orderDirection !== "DESC"))
  //   opt.orderDirection = "DESC";
  return opt as T;
}

/**
 * 상품 목록 조회 옵션
 * @property {string} name - 상품명
 * @property {number | null} categoryId - 카테고리 ID
 */
export type ProductListOption = {
  name: string;
  categoryId: number | null;
} & ListOption;
