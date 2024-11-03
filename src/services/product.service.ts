import type {
  Product,
  ProductListOption
} from "@/types";
import { validateListOption } from "@/types";
import {
  createProductDB,
  updateProductDB,
  softDeleteProductDB,
  hardDeleteProductDB,
  getProductDB,
  getAliveProductDB,
  listCategorizedProductDB,
  listNotCategorizedProductDB, countCategorizedProductDB, countNotCategorizedProductDB
} from "@/database/product";

/**
 * 상품 만들기
 * - 상품 기본 정보 생성
 * - 상품 대표 이미지 설정한 경우 생성, images.length > 0 OR mainImageUrl 값이 있는 경우
 * - 상품 상세설명 이미지 설정한 경우 생성, detailImages.length > 0
 * - 상품 옵션 설정한 경우 생성, options.length > 0
 * - 상품 카테고리 설정했는데 카테고리 테이블에 없는 경우 생성
 * - 상품 제조사 설정했는데 제조사 테이블에 없는 경우 생성
 * @param product, 상품 데이터
 * @param createCategory, 카테고리가 지정되었을 때 테이블에 없다면 함께 생성 여부 (default: false)
 * @param createManufacturer, 제조사가 지정되었을 때 테이블에 없다면 함께 생성 여부 (default: false)
 * @returns void
 */
export async function createProduct(product: Product | null, createCategory: boolean = false, createManufacturer: boolean = false) {
  if (!product) throw new Error("상품 정보가 없습니다");
  try {
    // 상품 만들기
    await createProductDB(product);
    // 카테고리가 지정되었는데 테이블에 없다면 함께 생성
    if (product.category && product.category.id == 0 && createCategory) {
      // TODO create category if not exists in category table
    }
    // 제조사가 지정되었는데 테이블에 없다면 함께 생성
    if (product.manufacturer && product.manufacturer.id == 0 && createManufacturer) {
      // TODO create manufacturer if not exists in manufacturer table
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 상품 수정하기
 * - 상품 기본 정보 수정
 * - 상품 대표 이미지 수정, images.length > 0 OR mainImageUrl 값이 있는 경우 (삭제 => 새로 생성)
 * - 상품 상세설명 이미지 수정, detailImages.length > 0 (삭제 => 새로 생성)
 * - 상품 옵션 수정, options.length > 0 (삭제 => 새로 생성)
 * - 상품 카테고리 설정했는데 카테고리 테이블에 없는 경우 생성
 * - 상품 제조사 설정했는데 제조사 테이블에 없는 경우 생성
 * @param product, 상품 데이터
 * @param createCategory, 카테고리가 지정되었을 때 테이블에 없다면 함께 생성 여부 (default: false)
 * @param createManufacturer, 제조사가 지정되었을 때 테이블에 없다면 함께 생성 여부 (default: false)
 * @returns Product, 수정된 상품 데이터
 */
export async function updateProduct(product: Product | null, createCategory: boolean = false, createManufacturer: boolean = false): Promise<Product> {
  if (!product) throw new Error("상품 정보가 없습니다.");
  try {
    // 상품 수정하기
    product = await updateProductDB(product);
    // 카테고리가 지정되었는데 테이블에 없다면 함께 생성
    if (product.category && product.category.id == 0 && createCategory) {
      // TODO create category if not exists in category table
    }
    // 제조사가 지정되었는데 테이블에 없다면 함께 생성
    if (product.manufacturer && product.manufacturer.id == 0 && createManufacturer) {
      // TODO create manufacturer if not exists in manufacturer table
    }
    return product;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 상품 삭제하기
 * @param id
 * @param hardDelete, 완전 삭제 여부 (default: false)
 * @returns void
 */
export async function deleteProduct(id: string, hardDelete: boolean = false) {
  // FIXME: 현재 무조건 Soft Delete, 상품을 이미 주문했는데 완전히 삭제하면 문제가 생길 수 있음
  // FIXME: Soft, Hard Delete 의 차이를 코드로 남기기 위해서 파라미터 추가
  hardDelete = false;

  try {
    // 상품 삭제하기
    if (!hardDelete) {
      // 삭제 플래그만 수정하고 관련 데이터 유지
      await softDeleteProductDB(id);
    } else {
      // 완전히 삭제하고 관련 데이터 모두 삭제
      await hardDeleteProductDB(id);
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 상품 조회하기
 * - 삭제된 것을 포함해서 조회할지 여부를 선택할 수 있음
 * @param id
 * @param allowDeleted, 삭제된 것도 조회 가능 여부 (default: false)
 * @returns Product
 */
export async function getProduct(id: string, allowDeleted: boolean = false): Promise<Product | null> {
  try {
    // 삭제된 것도 포함해서 조회
    if (allowDeleted) return await getProductDB(id);

    // 삭제된 것은 조회하지 않음
    return await getAliveProductDB(id);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 조건에 해당하는 상품 리스트 조회하기
 * - 이름으로 검색, LIKE 검색
 * - 지정된 카테고리로 검색, 하위 카테고리도 포함
 * - 전체, 삭제되지 않은 것만, 삭제된 것만 조회 가능
 * @param opt
 * @returns Product[]
 */
export async function listProduct(opt: ProductListOption): Promise<Product[]> {
  try {
    const validatedOption = validateListOption<ProductListOption>(opt);
    // TODO implement 카테고리를 검색 키워드로 하는 경우
    if (validatedOption.categoryId && validatedOption.categoryId !== 0)
      return await listCategorizedProductDB(validatedOption);

    // 카테고리를 검색 키워드로 하지 않는 경우
    return await listNotCategorizedProductDB(validatedOption);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 조건에 해당하는 상품 리스트 총 개수 조회하기
 * @param opt
 * @returns number
 */
export async function countProduct(opt: ProductListOption): Promise<number> {
  try {
    const validatedOption = validateListOption<ProductListOption>(opt);
    // TODO implement 카테고리를 검색 키워드로 하는 경우
    if (validatedOption.categoryId && validatedOption.categoryId !== 0)
      return await countCategorizedProductDB(validatedOption);

    // 카테고리를 검색 키워드로 하지 않는 경우
    return await countNotCategorizedProductDB(validatedOption);
  } catch (e: any) {
    throw new Error(e.message);
  }
}