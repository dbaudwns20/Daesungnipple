import type { ProductCategory } from "@/types";
import {
  createCategoryDB,
  deleteCategoryDB,
  updateCategoryDB,
  listAllCategoryFromDB
} from "@/database/product.category";

/**
 * 카테고리 생성
 * @param category
 * @returns ProductCategory
 */
export async function createCategory(category: ProductCategory | null): Promise<ProductCategory> {
  if (!category) throw new Error("카테고리 정보가 없습니다.");
  try {
    return await createCategoryDB(category);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 카테고리 수정
 * @param category
 * @returns ProductCategory
 */
export async function updateCategory(category: ProductCategory | null): Promise<ProductCategory> {
  if (!category) throw new Error("카테고리 정보가 없습니다.");
  try {
    return await updateCategoryDB(category);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 카테고리 삭제
 * @param categoryId
 * @param deleteRelatedProducts, 관련 상품 삭제 여부, false 이면 부착한 카테고리만 null로 변경
 */
export async function deleteCategory(categoryId: number, deleteRelatedProducts: boolean = false) {
  try {
    await deleteCategoryDB(categoryId, deleteRelatedProducts);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 최상위 카테고리 아이디 기준으로 하위 카테고리까지 리스트 조회
 * @param categoryId, 조회를 시작할 최상위 카테고리 아이디, 0이면 전체 카테고리 조회
 * @param name, 카테고리명에 포함된 문자열 LIKE 조회, 빈값이면 전체 조회
 * @param isActive, 활성화 여부에 따라 조회, null이면 전체 조회
 * @returns ProductCategory[]
 */
export async function listCategory(
  categoryId: number = 0,
  name: string = "",
  isActive: boolean | null = null
): Promise<ProductCategory[]> {
  try {
    if (categoryId === 0) return listAllCategoryFromDB(name, isActive);
    // TODO implement list category from top parent id
    return [];
  } catch (e: any) {
    throw new Error(e.message);
  }
}
