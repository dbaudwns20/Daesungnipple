export type ListOption = {
  page: number; // offset = (page - 1) * limit
  unit: number; // limit
  // orderBy: string // 정렬 기준
  // orderDirection: string // 정렬 방향
}

export function validateListOption<T>(opt: Partial<ListOption>): T {
  if (!opt.page || opt.page < 1) opt.page = 1;
  if (!opt.unit || opt.unit < 1) opt.unit = 20;
  // if (!opt.orderBy || opt.orderBy === "") opt.orderBy = "created_at";
  // if (!opt.orderDirection || (opt.orderDirection !== "ASC" && opt.orderDirection !== "DESC"))
  //   opt.orderDirection = "DESC";
  return opt as T;
}