import { prisma } from "@/prisma";

import type { ProductCategory } from "@prisma/client";

import {
  type ProductCategoryForAdmin,
  bindProductCategoryListForAdmin,
} from "@/types/product.category";

export async function getCategoryList(
  isForAdmin: boolean,
): Promise<ProductCategoryForAdmin[]> {
  const whereQuery: object = isForAdmin ? {} : { isActive: true };

  const list = await prisma.productCategory.findMany({
    where: whereQuery,
    orderBy: [{ parentId: "asc" }, { viewOrder: "asc" }],
  });

  return isForAdmin ? bindProductCategoryListForAdmin(list) : [];
}

/**
 * 자식 카테고리 아이디 모두 조회
 * @param parentId
 * @returns
 */
async function getAllChildCategoryIds(parentId: number): Promise<number[]> {
  const children: ProductCategory[] = await prisma.productCategory.findMany({
    where: { parentId },
  });
  // 아이디만 추출
  let ids: number[] = children.map((it: ProductCategory) => it.id);
  // 재귀로 자식 카테고리 아이디 갱신
  for (let child of children)
    ids = [...ids, ...(await getAllChildCategoryIds(child.id))];
  return ids;
}

/**
 * 카테고리 삭제
 * @param categoryId
 */
export async function deleteCategory(categoryId: number) {
  const category: ProductCategory | null =
    await prisma.productCategory.findFirst({
      where: { id: categoryId },
    });

  if (!category) throw new Error("존재하지 않는 카테고리입니다.");

  // 자식 카테고리 id 모두 조회
  const childrenIds: number[] = await getAllChildCategoryIds(categoryId);

  // 삭제 대상과 자식 카테고리 데이터 제거
  await prisma.$transaction(async (prisma) => {
    await prisma.productCategory.deleteMany({
      where: { id: { in: [categoryId, ...childrenIds] } },
    });
  });
}
