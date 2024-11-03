// import type { ListResult, ProductCategory } from "@/types";
// import {
//   createCategoryDB,
//   deleteCategoryDB,
//   updateCategoryDB,
//   listAllCategoryFromDB,
//   getHierarchyCategoryIdsFromDB
// } from "@/database/product.category";
// import { ProductCategoryListOption } from "@/types";
//
// /**
//  * 카테고리 생성
//  * @param category
//  * @returns ProductCategory
//  */
// export async function createCategory(category: ProductCategory | null): Promise<ProductCategory> {
//   if (!category) throw new Error("카테고리 정보가 없습니다.");
//   try {
//     return await createCategoryDB(category);
//   } catch (e: any) {
//     throw new Error(e.message);
//   }
// }
//
// /**
//  * 카테고리 수정
//  * @param category
//  * @returns ProductCategory
//  */
// export async function updateCategory(category: ProductCategory | null): Promise<ProductCategory> {
//   if (!category) throw new Error("카테고리 정보가 없습니다.");
//   try {
//     return await updateCategoryDB(category);
//   } catch (e: any) {
//     throw new Error(e.message);
//   }
// }
//
// /**
//  * 카테고리 삭제
//  * @param categoryId
//  * @param deleteChildren, 하위 카테고리 삭제 여부, true 이면 부모로부터 하위 전부 삭제
//  * @param deleteRelatedProducts, 관련 상품 삭제 여부, false 이면 부착한 카테고리만 null로 변경
//  */
// export async function deleteCategory(
//   categoryId: number,
//   deleteChildren: boolean = true,
//   deleteRelatedProducts: boolean = false
// ) {
//   let ids = [ categoryId ];
//   try {
//     // 하위 카테고리 모두 찾아서 삭제하는 경우
//     if (deleteChildren) {
//       // 카테고리 관련 아이디 전부 조회
//       ids = await getHierarchyCategoryIdsFromDB(categoryId);
//     }
//     await deleteCategoryDB(ids, deleteRelatedProducts);
//   } catch (e: any) {
//     throw new Error(e.message);
//   }
// }
//
// /**
//  * 최상위 카테고리 아이디 기준으로 하위 카테고리까지 리스트 조회
//  * @param opt
//  * @returns ProductCategory[]
//  */
// export async function listCategory(opt: ProductCategoryListOption): Promise<ListResult> {
//   try {
//     // 관련 하위 카테고리 아이디 전부 조회
//     if (opt.ids && opt.ids.length !== 0)
//       opt.ids = await getHierarchyCategoryIdsFromDB(opt.ids[0]);
//
//     // 전체 카테고리 조회
//     const list = await listAllCategoryFromDB(opt);
//     const totalCount = list ? list.length : 0;
//
//     return { list, totalCount } as ListResult;
//   } catch (e: any) {
//     throw new Error(e.message);
//   }
// }
