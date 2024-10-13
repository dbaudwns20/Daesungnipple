import type { Manufacturer } from "@/types/manufacturer";
import type { ListOption } from "@/types/sarch.option";

// Product 상품
export type Product = {
  id: number; // 상품 ID
  createdAt: Date; // 생성일
  exposed: boolean; // 노출 여부
  exposedAt: Date | null; // 노출일
  name: string; // 상품명
  modelName: string; // 모델명
  mainImageUrl: string; // 대표 이미지
  previewDescription: string; // 상품 요약설명
  description: string; // 상품설명
  price: number; // 가격
  stockCount: number; // TODO 고민 => 재고 수량, 0 이면 무제한 -1이면 품절, 1이상이면 해당 수량만큼 재고
  images: ProductImage[]; // 상품 이미지
  detailImages: ProductDetailImage[]; // 상품 상세설명 이미지
  manufacturer: Manufacturer | null; // 제조사
  optionDescription: string; // 옵션 설명
  options: ProductOption[]; // 상품 옵션
  category: ProductCategory | null; // 상품 카테고리
}

export type ProductListOption = {
  name: string;
  categoryId: number | null;
} & ListOption;

/**
 * 상품 생성, 수정을 위한 데이터 만들기
 * @param product
 * @returns any
 */
export function dataFromProduct(product: Product): any {
  return {
    name: product.name,
    modelName: product.modelName,
    mainImageUrl: product.mainImageUrl,
    exposedAt: product.exposed ? new Date() : null,
    previewDescription: product.previewDescription,
    description: product.description,
    price: Number(product.price),
    stockCount: Number(product.stockCount),
    manufacturerId: product.manufacturer && product.manufacturer.id !== 0 ? product.manufacturer.id : null,
    optionDescription: product.optionDescription,
    categoryId: product.category && product.category.id !== 0 ? product.category.id : null
  };
}

/**
 * 상품 초기화 (Page 용)
 * @returns Product
 */
export function initProduct(): Product {
  return {
    id: 0,
    createdAt: new Date(),
    exposed: false,
    exposedAt: null,
    name: "",
    modelName: "",
    mainImageUrl: "",
    previewDescription: "",
    description: "",
    price: 0,
    stockCount: 0,
    images: [],
    detailImages: [],
    manufacturer: null,
    optionDescription: "",
    options: [],
    category: null
  };
}

// ProductImage 상품 이미지
export type ProductImage = {
  id: number; // 이미지 ID
  productId: number; // 상품 ID
  createdAt: Date; // 생성일
  url: string; // 이미지 URL
  viewOrder: number; // 이미지 순서
}

/**
 * 상품 이미지 생성을 위한 데이터 만들기
 * @param productId 상품 아이디
 * @param url 이미지 URL
 * @param viewOrder 이미지 순서
 * @returns any
 */
export function dataFromProductImage(productId: number, url: string, viewOrder: number): any {
  return {
    productId: productId,
    url: url,
    viewOrder: viewOrder
  };
}

// ProductDetailImage 상품 상세설명 이미지
export type ProductDetailImage = {
  id: number; // 이미지 ID
  productId: number; // 상품 ID
  createdAt: Date; // 생성일
  url: string; // 이미지 URL
  viewOrder: number; // 이미지 순서
}

/**
 * 상품 상세설명 이미지 생성을 위한 데이터 만들기
 * @param productId 상품 아이디
 * @param url 이미지 URL
 * @param viewOrder 이미지 순서
 * @returns any
 */
export function dataFromProductDetailImage(productId: number, url: string, viewOrder: number): any {
  return {
    productId: productId,
    url: url,
    viewOrder: viewOrder
  };
}

// ProductOption 상품 구매 옵션
export type ProductOption = {
  id: number; // 옵션 ID
  productId: number; // 상품 ID
  createdAt: Date; // 생성일
  name: string; // 옵션명
  price: number; // 옵션 추가 가격
  stockCount: number; // TODO 고민 => 재고 수량, 0 이면 무제한 -1이면 품절, 1이상이면 해당 수량만큼 재고
  isDefault: boolean; // 기본 옵션 여부
  viewOrder: number; // 옵션 순서
}

/**
 * 상품 옵션 생성을 위한 데이터 만들기
 * @param productId 상품 아이디
 * @param option
 * @returns any
 */
export function dataFromProductOption(productId: number, option: ProductOption): any {
  return {
    productId: productId,
    name: option.name,
    price: option.price,
    stockCount: option.stockCount,
    isDefault: option.isDefault,
    viewOrder: option.viewOrder
  };
}

// ProductCategory 상품 카테고리
export type ProductCategory = {
  id: number; // 카테고리 ID
  parentId: number | null; // 상위 카테고리 ID
  createdAt: Date; // 생성일
  name: string; // 카테고리명
  children: ProductCategory[];
}
