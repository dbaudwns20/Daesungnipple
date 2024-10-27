import { SearchOption } from "@/types/option.search";
import { ListOption } from "@/types/option.list";

/**
 * 상품 목록 조회 옵션
 * @property {string} name - 상품명
 * @property {number | null} categoryId - 카테고리 ID
 */
export type ProductListOption = {
  name: string;
  categoryIds: number[] | null;
} & ListOption;

/**
 * 상품 목록 조회 옵션 쿼리 컨디션으로 변환
 * @param opt
 */
export function getProductListOptionAsCondition(opt: ProductListOption): any {
  const nameConditionExists = opt.name && opt.name !== "";
  const categoryConditionExists = opt.categoryIds && opt.categoryIds.length !== 0;
  switch (opt.searchOption) {
    case SearchOption.ALL:
      if (nameConditionExists && categoryConditionExists) {
        return { AND: [ { name: { contains: opt.name } }, { categoryId: { in: opt.categoryIds } } ] };
      } else if (nameConditionExists) {
        return { name: { contains: opt.name } };
      } else if (categoryConditionExists) {
        return { categoryId: { in: opt.categoryIds } };
      }
      return {};
    case SearchOption.ALIVE:
      if (nameConditionExists && categoryConditionExists) {
        return { AND: [ { name: { contains: opt.name } }, { categoryId: { in: opt.categoryIds } }, { deletedAt: null } ] };
      } else if (nameConditionExists) {
        return { AND: [ { name: { contains: opt.name } }, { deletedAt: null } ] };
      } else if (categoryConditionExists) {
        return { AND: [ { categoryId: { in: opt.categoryIds } }, { deletedAt: null } ] };
      }
      return { AND: [ { deletedAt: null } ] };
    case SearchOption.ALIVE_ACTIVE:
      if (nameConditionExists && categoryConditionExists) {
        return { AND: [ { name: { contains: opt.name } }, { categoryId: { in: opt.categoryIds } }, { deletedAt: null }, { exposedAt: { not: null } } ] };
      } else if (nameConditionExists) {
        return { AND: [ { name: { contains: opt.name } }, { deletedAt: null }, { exposedAt: { not: null } } ] };
      } else if (categoryConditionExists) {
        return { AND: [ { categoryId: { in: opt.categoryIds } }, { deletedAt: null }, { exposedAt: { not: null } } ] };
      }
      return { AND: [ { deletedAt: null }, { exposedAt: { not: null } } ] };
    case SearchOption.ALIVE_INACTIVE:
      if (nameConditionExists && categoryConditionExists) {
        return { AND: [ { name: { contains: opt.name } }, { categoryId: { in: opt.categoryIds } }, { deletedAt: null }, { exposedAt: null } ] };
      } else if (nameConditionExists) {
        return { AND: [ { name: { contains: opt.name } }, { deletedAt: null }, { exposedAt: null } ] };
      } else if (categoryConditionExists) {
        return { AND: [ { categoryId: { in: opt.categoryIds } }, { deletedAt: null }, { exposedAt: null } ] };
      }
      return { AND: [ { deletedAt: null }, { exposedAt: null } ] };
    case SearchOption.DELETED:
      if (nameConditionExists && categoryConditionExists) {
        return { AND: [ { name: { contains: opt.name } }, { categoryId: { in: opt.categoryIds } }, { deletedAt: { not: null } } ] };
      } else if (nameConditionExists) {
        return { AND: [ { name: { contains: opt.name } }, { deletedAt: { not: null } } ] };
      } else if (categoryConditionExists) {
        return { AND: [ { categoryId: { in: opt.categoryIds } }, { deletedAt: { not: null } } ] };
      }
      return { AND: [ { deletedAt: { not: null } } ] };
  }
}