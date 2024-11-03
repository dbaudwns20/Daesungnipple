import { prisma } from "@/prisma";
import type { ProductCategory } from "@/types";
import {
  bindFromArray,
  dataFromProductCategory, groupByParentId,
  productCategoryFromDB,
  productCategoryListFromDB
} from "@/types";

/**
 * 카테고리 생성하고 리턴하기
 * @param category
 * @returns ProductCategory
 */
export async function createCategoryDB(category: ProductCategory): Promise<ProductCategory> {
  const res = await prisma.productCategory.create({ data: dataFromProductCategory(category) });
  return productCategoryFromDB(res)!;
}

/**
 * 카테고리 수정하고 리턴하기
 * @param category
 * @returns ProductCategory
 */
export async function updateCategoryDB(category: ProductCategory): Promise<ProductCategory> {
  await prisma.productCategory.update({
    where: { id: category.id },
    data: dataFromProductCategory(category)
  });
  return category;
}

/**
 * 카테고리 삭제하기
 * @param id - 삭제할 카테고리 아이디
 * @param deleteRelatedProducts - 관련 상품 삭제 여부, false 이면 부착한 카테고리만 null로 변경
 * @returns void
 */
export async function deleteCategoryDB(id: number, deleteRelatedProducts: boolean = false) {
  await prisma.$transaction(async (tx) => {
    // 관련된 모든 카테고리 아이디 찾기
    // @ts-ignore
    const idRes = await tx.productCategory.$queryRaw`
        WITH RECURSIVE CategoryHierarchy AS (SELECT id, parent_id
                                             FROM product_category
                                             WHERE id = ${ id }
                                             UNION ALL
                                             SELECT c.id, c.parent_id
                                             FROM product_category c
                                                      INNER JOIN CategoryHierarchy ch ON c.parent_id = ch.id)
        SELECT id
        FROM CategoryHierarchy;
    `;
    const ids = idRes.map((it: { id: number }) => it.id);
    if (ids.length === 0) return;

    // 해당 카테고리와 해당 카테로기를 부모로 하는 모든 하위 카테고리 삭제
    await tx.productCategory.deleteMany({ where: { id: { in: ids } } });

    // 관련 상품 삭제 여부에 따라 처리
    if (deleteRelatedProducts) {
      // 지워지는 카테고리를 가지고 있는 상품들 삭제
      await tx.product.updateMany({ where: { categoryId: { in: ids } }, data: { deletedAt: new Date() } });
    } else {
      // 지워지는 카테고리를 가지고 있는 상품들의 카테고리를 null로 변경
      await tx.product.updateMany({
        where: { categoryId: { in: ids } },
        data: { categoryId: null }
      });
    }
  });
}

/**
 * 상위 카테고리 아이디 기준으로 하위 카테고리까지 리스트 조회
 * @param name - 카테고리명에 포함된 문자열 LIKE 조회, 빈값이면 전체 조회
 * @param isActive - 활성화 여부
 * @returns ProductCategory[]
 */
export async function listAllCategoryFromDB(name: string = "", isActive: boolean | null = null): Promise<ProductCategory[]> {
  let where: any = {};
  if (name !== "" && isActive !== null) {
    where = { AND: [ { name: { contains: name } }, { isActive: isActive } ] };
  } else if (name !== "") {
    where = { name: { contains: name } };
  } else if (isActive !== null) {
    where = { isActive: isActive };
  }
  if (name !== "") where["name"] = { contains: name };
  const res = await prisma.productCategory.findMany({
    where: where,
    orderBy: [ { parentId: "asc" }, { viewOrder: "asc" } ]
  });
  if (!res || res.length === 0) return [];

  // 카테고리 트리 구조로 만들기
  const flatCategories = bindFromArray<ProductCategory>(res);
  const groupMap = groupByParentId(flatCategories);
  return productCategoryListFromDB(res);
}