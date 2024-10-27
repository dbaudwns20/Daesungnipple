import type { Manufacturer as ManufacturerDB } from "@prisma/client";
import type { Product } from "@/types";
import { productListFromDB } from "@/types";

/**
 * 제조사 데이터
 * @property {number} id - 제조사 ID(=Prisma)
 * @property {string} name - 제조사명(=Prisma)
 * @property {string} siteUrl - 제조사 홈페이지 링크(=Prisma)
 * @property {Date | null} createdAt - 생성일(=Prisma)
 * @property {Product[]} products - 제조사와 관련된 상품(=Prisma)
 */
export type Manufacturer = {
  id: number;
  name: string; // 제조사명
  siteUrl: string; // 제조사 홈페이지 링크
  createdAt: Date | null;
  products: Product[]; // 제조사와 관련된 상품을 함께 검색할 수 있음
}

/**
 * DB 제조사 생성, 수정을 위한 데이터 만들기
 * @param manufacturer
 * @returns any
 */
export function dataFromManufacturer(manufacturer: Manufacturer): any {
  return {
    name: manufacturer.name.trim(),
    siteUrl: manufacturer.siteUrl.trim()
  };
}

/**
 * DB 제조사 데이터를 Manufacturer로 변환
 * @param manufacturer
 * @returns Manufacturer
 */
export function manufacturerFromDB(manufacturer: ManufacturerDB | null | undefined): Manufacturer | null {
  if (!manufacturer) return null;
  return {
    id: manufacturer.id,
    name: manufacturer.name,
    siteUrl: manufacturer.siteUrl,
    createdAt: manufacturer.createdAt,
    // @ts-ignore
    products: productListFromDB(manufacturer.products)
  } as Manufacturer;
}

/**
 * DB 제조사 데이터 배열을 Manufacturer 배열로 변환
 * @param manufacturers
 * @returns Manufacturer[]
 */
export function manufacturerListFromDB(manufacturers: ManufacturerDB[] | null | undefined): Manufacturer[] {
  if (!manufacturers) return [];
  return manufacturers.map((it: ManufacturerDB) => manufacturerFromDB(it)).filter((manufacturer) => manufacturer !== null);
}
