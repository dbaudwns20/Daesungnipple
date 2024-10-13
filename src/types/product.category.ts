import type { ProductCategory } from "@prisma/client";

export interface ProductCategoryForAdmin extends ProductCategory {
  _children?: ProductCategoryForAdmin[]; // 자식 카테고리
  _attributes?: {
    expanded: boolean; // 확장여부
  };
}

function groupByParentId(
  list: ProductCategory[],
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

function bindProductCategoryForAdmin(
  parentId: number | null,
  groupedMap: Map<number | null, ProductCategory[]>,
): ProductCategoryForAdmin[] {
  const parentList: ProductCategory[] = groupedMap.get(parentId) || [];
  if (parentList.length > 0) {
    return parentList.map((it: ProductCategory) => {
      const childrenList: ProductCategoryForAdmin[] =
        bindProductCategoryForAdmin(it.id, groupedMap);
      return {
        ...it,
        // childrenList 존재하는 경우에만 붙인다 (Toast Ui Grid 특성)
        ...(childrenList.length > 0
          ? {
              _children: childrenList,
              _attributes: { expanded: false },
            }
          : {}),
      };
    });
  } else return parentList;
}

/**
 * 관리자 페이지용 포맷으로 바인딩
 * @param list
 * @returns
 */
export function bindProductCategoryListForAdmin(
  list: ProductCategory[],
): ProductCategoryForAdmin[] {
  // 자식을 갖고있는 데이터를 미리 계산한다.
  const groupedMap: Map<number | null, ProductCategory[]> =
    groupByParentId(list);
  return bindProductCategoryForAdmin(null, groupedMap);
}
