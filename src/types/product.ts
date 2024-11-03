import type { Product as ProductDB } from "@prisma/client";
import type {
  ProductImage,
  ProductDetailImage,
  ProductOption,
  Manufacturer,
  ProductCategory
} from "@/types";
import {
  manufacturerFromDB,
  productCategoryFromDB,
  bindFromArray
} from "@/types";

/**
 * 상품 데이터
 * @property {string} id - 상품 ID(=Prisma)
 * @property {Date} createdAt - 생성일(=Prisma)
 * @property {boolean} exposed - 노출 여부(<>Prisma), 생성 수정 전에 exposed ? exposedAt = new Date() : exposedAt = null
 * @property {Date | null} exposedAt - 노출일(=Prisma)
 * @property {string} name - 상품명(=Prisma)
 * @property {string} modelName - 모델명(=Prisma)
 * @property {string} mainImageUrl - 대표 이미지 URL(=Prisma), images[0]과 동일
 * @property {string} previewDescription - 상품 요약설명(=Prisma)
 * @property {string} description - 상품설명(=Prisma)
 * @property {number} price - 가격(=Prisma)
 * @property {number} stockCount - 재고 수량(=Prisma), 0 이면 무제한 -1이면 품절, 1이상이면 해당 수량만큼 재고
 * @property {ProductImage[]} images - 상품 이미지(=Prisma)
 * @property {ProductDetailImage[]} detailImages - 상품 상세설명 이미지(=Prisma)
 * @property {Manufacturer | null} manufacturer - 제조사(=Prisma)
 * @property {string} optionDescription - 옵션 설명(=Prisma)
 * @property {ProductOption[]} options - 상품 옵션(=Prisma)
 * @property {ProductCategory | null} category - 상품 카테고리(=Prisma)
 */
export type Product = {
  id: string; // 상품 ID
  createdAt: Date; // 생성일
  exposed: boolean; // 노출 여부
  exposedAt: Date | null; // 노출일, null 이면 고객에게 노출 안함
  name: string; // 상품명
  modelName: string; // 모델명
  mainImageUrl: string; // 대표 이미지, images[0]과 동일
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

/**
 * DB 상품 생성, 수정을 위한 데이터 만들기
 * @param product
 * @returns any
 */
export function dataFromProduct(product: Product): any {
  return {
    name: product.name.trim(),
    modelName: product.modelName.trim(),
    mainImageUrl: product.images && product.images.length > 0 ? product.images[0].url : product.mainImageUrl.trim(),
    exposedAt: product.exposed ? new Date() : null,
    previewDescription: product.previewDescription.trim(),
    description: product.description.trim(),
    price: Number(product.price),
    stockCount: Number(product.stockCount),
    manufacturerId: product.manufacturer && product.manufacturer.id !== 0 ? product.manufacturer.id : null,
    optionDescription: product.optionDescription.trim(),
    categoryId: product.category && product.category.id !== 0 ? product.category.id : null
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
    exposed: !product.exposedAt,
    exposedAt: product.exposedAt,
    name: product.name,
    modelName: product.modelName,
    mainImageUrl: product.mainImageUrl,
    previewDescription: product.previewDescription,
    description: product.description,
    price: product.price,
    stockCount: product.stockCount,
    // @ts-ignore
    images: bindFromArray<ProductImage>(product.images),
    // @ts-ignore
    detailImages: bindFromArray<ProductDetailImage>(product.detailImages),
    // @ts-ignore
    manufacturer: manufacturerFromDB(product.manufacturer),
    optionDescription: product.optionDescription,
    // @ts-ignore
    options: bindFromArray<ProductOption>(product.options),
    // @ts-ignore
    category: productCategoryFromDB(product.category)
  } as Product;
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
