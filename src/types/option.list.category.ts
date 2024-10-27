/**
 * ProductCategoryListOption type.
 */
export type ProductCategoryListOption = {
  ids: number[] | null;
  name: string;
  isActive: boolean | null;
}

/**
 * 상품 카테고리 목록 조회 옵션 쿼리 컨디션으로 변환
 * @param opt
 */
export function getProductCategoryListOptionAsCondition(opt: ProductCategoryListOption): any {
  const idConditionExists = opt.ids && opt.ids.length !== 0;
  const nameConditionExists = opt.name && opt.name !== "";
  const isActiveConditionExists = opt.isActive !== null;
  if (idConditionExists && nameConditionExists && isActiveConditionExists) {
    return { AND: [ { id: { in: opt.ids } }, { name: { contains: opt.name } }, { isActive: opt.isActive } ] };
  } else if (idConditionExists && nameConditionExists) {
    return { AND: [ { id: { in: opt.ids } }, { name: { contains: opt.name } } ] };
  } else if (idConditionExists && isActiveConditionExists) {
    return { AND: [ { id: { in: opt.ids } }, { isActive: opt.isActive } ] };
  } else if (nameConditionExists && isActiveConditionExists) {
    return { AND: [ { name: { contains: opt.name } }, { isActive: opt.isActive } ] };
  } else if (idConditionExists) {
    return { id: { in: opt.ids } };
  } else if (nameConditionExists) {
    return { name: { contains: opt.name } };
  } else if (isActiveConditionExists) {
    return { isActive: opt.isActive };
  }
  return {};
}
