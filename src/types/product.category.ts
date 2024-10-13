import type { ProductCategory as ProductCategoryDB } from "@prisma/client";

/**
 * 상품 카테고리
 * @property {number} id - 카테고리 ID
 * @property {number | null} parentId - 상위 카테고리 ID
 * @property {Date} createdAt - 생성일
 * @property {string} name - 카테고리명
 * @property {ProductCategory[]} children - 자식 카테고리
 */
export type ProductCategory = {
  id: number; // 카테고리 ID
  parentId: number | null; // 상위 카테고리 ID
  createdAt: Date; // 생성일
  name: string; // 카테고리명
  children: ProductCategory[];
  expanded: boolean; // 확장여부 children.length > 0 (Toast Ui Grid 특성)
}

/**
 * DB 상품 카테고리 생성, 수정을 위한 데이터 만들기
 * @param category
 * @returns any
 */
export function dataFromProductCategory(category: ProductCategory): any {
  return {
    parentId: category.parentId,
    name: category.name.trim()
  };
}

/**
 * DB 상품 카테고리 데이터를 ProductCategory로 변환
 * @param productCategory
 * @returns ProductCategory
 */
export function productCategoryFromDB(productCategory: ProductCategoryDB | null | undefined): ProductCategory | null {
  if (!productCategory) return null;
  return {
    id: productCategory.id,
    parentId: productCategory.parentId,
    createdAt: productCategory.createdAt,
    name: productCategory.name,
    // @ts-ignore
    children: productCategoryListFromDB(productCategory.children),
    // @ts-ignore
    expanded: productCategory.children && productCategory.children.length > 0
  } as ProductCategory;
}

/**
 * DB 상품 카테고리 데이터 배열을 ProductCategory 배열로 변환
 * @param productCategories
 * @returns ProductCategory[]
 */
export function productCategoryListFromDB(productCategories: ProductCategoryDB[] | null | undefined): ProductCategory[] {
  if (!productCategories) return [];
  return productCategories.map((it: ProductCategoryDB) => productCategoryFromDB(it)).filter((category) => category !== null);
}

/**
 * 상품 카테고리 리스트를 부모 카테고리 ID로 그룹화
 * @param list
 * @returns Map<number | null, ProductCategory[]>
 */
export function groupByParentId(
  list: ProductCategory[]
): Map<number | null, ProductCategory[]> {
  const groupMap: Map<number | null, ProductCategory[]> = new Map();

  list.forEach((it: ProductCategory) => {
    const parentId: number | null = it.parentId;
    if (!groupMap.has(parentId)) {
      groupMap.set(parentId, []);
    }
    groupMap.get(parentId)?.push(it);
  });

  return groupMap;
}
