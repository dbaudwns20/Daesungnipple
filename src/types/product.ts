import type { Product as ProductDB } from "@prisma/client";
import type {
  ProductImage,
  ProductOption
} from "@/types";
import {
  bindFromArray
} from "@/types";

/**
 * 상품 데이터
 * @property {string} id - 상품 ID(=Prisma)
 * @property {Date} createdAt - 생성일(=Prisma)
 * @property {Date} updatedAt - 수정일(=Prisma)
 * @property {Date | null} deletedAt - 삭제일(=Prisma), null 이면 삭제 안함
 * @property {string} name - 상품명(=Prisma)
 * @property {string} previewDescription - 상품 요약설명(=Prisma)
 * @property {number} defaultPrice - 기본 가격(=Prisma)
 * @property {string} mainImageUrl - 대표 이미지 URL(=Prisma)
 * @property {string} modelName - 모델명(=Prisma)
 * @property {string} optionDescription - 옵션 설명(=Prisma)
 * @property {boolean} isOptionRequired - 옵션 필수 여부(=Prisma)
 *
 * @property {ProductImage[]} descriptionImages - 상품 설명 이미지(=Prisma)
 * @property {ProductOption[]} options - 상품 옵션(=Prisma)
 */
export type Product = {
  id: string; // 상품 ID

  createdAt: Date; // 생성일
  updatedAt: Date; // 수정일
  deletedAt: Date | null; // 삭제일, null 이면 삭제 안함

  name: string; // 상품명
  previewDescription: string; // 상품 요약설명
  defaultPrice: number; // 기본 가격
  mainImageUrl: string; // 대표 이미지 URL
  modelName: string; // 모델명
  optionDescription: string; // 옵션 설명
  isOptionRequired: boolean; // 옵션 필수 여부

  descriptionImages: ProductImage[]; // 상품 이미지
  options: ProductOption[]; // 상품 옵션
}

/**
 * DB 상품 생성, 수정을 위한 데이터 만들기
 * @param product
 * @returns any
 */
export function dataFromProduct(product: Product): any {
  return {
    // TODO
    // name: product.name.trim(),
    // modelName: product.modelName.trim(),
    // mainImageUrl: product.images && product.images.length > 0 ? product.images[0].url : product.mainImageUrl.trim(),
    // exposedAt: product.exposed ? new Date() : null,
    // previewDescription: product.previewDescription.trim(),
    // description: product.description.trim(),
    // price: Number(product.price),
    // stockCount: Number(product.stockCount),
    // manufacturerId: product.manufacturer && product.manufacturer.id !== 0 ? product.manufacturer.id : null,
    // optionDescription: product.optionDescription.trim(),
    // categoryId: product.category && product.category.id !== 0 ? product.category.id : null
  };
}

/**
 * 상품 초기화 (Page 용)
 * @returns Product
 */
export function initProduct(): Product {
  return {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    name: "",
    previewDescription: "",
    defaultPrice: 0,
    mainImageUrl: "",
    modelName: "",
    optionDescription: "",
    isOptionRequired: false,
    descriptionImages: [],
    options: []
  };
}

/**
 * DB 상품 데이터를 Product로 변환
 * @param product
 * @returns Product
 */
export function productFromDB(product: ProductDB | null | undefined): Product | null {
  if (!product) return null;
  return {
    id: product.id,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    deletedAt: product.deletedAt,
    name: product.name,
    previewDescription: product.previewDescription,
    defaultPrice: product.defaultPrice,
    mainImageUrl: product.mainImageUrl,
    modelName: product.modelName,
    optionDescription: product.optionDescription,
    isOptionRequired: product.isOptionRequired,
    // @ts-ignore
    descriptionImages: bindFromArray<ProductImage>(product.descriptionImages),
    // @ts-ignore
    options: bindFromArray<ProductOption>(product.options)
  };

}

/**
 * DB 상품 데이터 배열을 Product 배열로 변환
 * @param products
 * @returns Product[]
 */
export function productListFromDB(products: ProductDB[] | null | undefined): Product[] {
  if (!products) return [];
  return products.map((it: ProductDB) => productFromDB(it)).filter((product) => product !== null);
}
