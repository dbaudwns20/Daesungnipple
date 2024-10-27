import { prisma } from "@/prisma";
import type { ProductCategory, ProductCategoryListOption } from "@/types";
import {
  bindFromArray,
  dataFromProductCategory, getProductCategoryListOptionAsCondition, groupByParentId,
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
 * @param ids - 삭제할 카테고리 아이디
 * @param deleteRelatedProducts - 관련 상품 삭제 여부, false 이면 부착한 카테고리만 null로 변경
 * @returns void
 */
export async function deleteCategoryDB(ids: number[], deleteRelatedProducts: boolean = false) {
  if (ids.length === 0) return;

  await prisma.$transaction(async (tx) => {
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
 * 카테고리 아이디로 관련 카테고리 전부 조회
 * @param id
 * @returns number[]
 */
export async function getHierarchyCategoryIdsFromDB(id: number): Promise<number[]> {
  // @ts-ignore
  const res = await prisma.productCategory.$queryRaw`
      WITH RECURSIVE CategoryHierarchy AS (SELECT id, parent_id
                                           FROM tbl_product_category
                                           WHERE id = ${ id }
                                           UNION ALL
                                           SELECT c.id, c.parent_id
                                           FROM tbl_product_category c
                                                    INNER JOIN CategoryHierarchy ch ON c.parent_id = ch.id)
      SELECT id
      FROM CategoryHierarchy;
  `;
  return res.map((it: { id: number }) => it.id);
}

/**
 * 상위 카테고리 아이디 기준으로 하위 카테고리까지 리스트 조회
 * @param opt - ProductCategoryListOption
 * @returns ProductCategory[]
 */
export async function listAllCategoryFromDB(opt: ProductCategoryListOption): Promise<ProductCategory[]> {
  const res = await prisma.productCategory.findMany({
    where: getProductCategoryListOptionAsCondition(opt),
    orderBy: [ { parentId: "asc" }, { viewOrder: "asc" } ]
  });
  if (!res || res.length === 0) return [];

  // 카테고리 바인딩하기
  const flatCategories = bindFromArray<ProductCategory>(res);
  // 카테고리 트리 구조로 만들기
  return groupByParentId(flatCategories);
}