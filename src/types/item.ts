import type { Item as ItemDB } from "@prisma/client";

import type {
  ItemImage,
  StringSearchOption,
  NumberRangeSearchOption,
  NumberExactSearchOption,
} from "@/types";
import { bindFromArray, type ListOption } from "@/types";

/**
 * 물건 검색 옵션
 * @property {StringSearchOption | null} name - 물건명 검색 옵션
 * @property {StringSearchOption | null} description - 물건 설명 검색 옵션
 * @property {NumberExactSearchOption | NumberRangeSearchOption | null} stockCount - 재고 수량 검색 옵션
 */
export type ItemSearchOption = {
  name: StringSearchOption | null; // 물건명 검색 옵션
  description: StringSearchOption | null; // 물건 설명 검색 옵션
  stockCount: NumberExactSearchOption | NumberRangeSearchOption | null; // 재고 수량 검색 옵션
} & ListOption;

/**
 * 물건 검색 옵션 초기화
 */
export function initItemSearchOption(): ItemSearchOption {
  return {
    name: null,
    description: null,
    stockCount: null,
    page: 1,
    unit: 10,
  };
}

/**
 * 물건 데이터
 * @property {number} id - 물건 ID(=Prisma)
 * @property {Date} createdAt - 생성일(=Prisma)
 * @property {Date} updatedAt - 수정일(=Prisma)
 * @property {Date | null} deletedAt - 삭제일(=Prisma), null 이면 삭제 안함
 * @property {string} name - 물건명(=Prisma)
 * @property {string} description - 물건 설명(=Prisma)
 * @property {number} stockCount - 재고 수량(=Prisma), 0 이면 무제한 -1이면 품절, 1이상이면 해당 수량만큼 재고
 *
 * @property {ItemImage[]} images - 물건 이미지(=Prisma)
 */
export type Item = {
  id: number; // 물건 ID

  createdAt: Date; // 생성일
  updatedAt: Date; // 수정일
  deletedAt: Date | null; // 삭제일, null 이면 삭제 안함

  name: string; // 물건명
  description: string; // 물건 설명
  stockCount: number; // 재고 수량 0 이면 무제한 -1이면 품절, 1이상이면 해당 수량만큼 재고

  images: ItemImage[]; // 물건 이미지
};

/**
 * DB 물건 생성, 수정을 위한 데이터 만들기
 * @param item
 * @returns any
 */
export function dataFromItem(item: Item): any {
  return {
    name: item.name.trim(),
    description: item.description.trim(),
    stockCount: item.stockCount,
  };
}

/**
 * 물건 초기화 (Page 용)
 * @returns Item
 */
export function initItem(): Item {
  return {
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    name: "",
    description: "",
    stockCount: 0,
    images: [],
  };
}

/**
 * DB 물건 데이터를 Item으로 변환
 * @param item
 */
export function itemFromDB(item: ItemDB): Item {
  return {
    id: item.id,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    deletedAt: item.deletedAt,
    name: item.name,
    description: item.description,
    stockCount: item.stockCount,
    // @ts-ignore
    images: bindFromArray<ItemImage>(item.images),
  } as Item;
}

/**
 * DB 물건 데이터 배열을 Item 배열로 변환
 * @param items
 */
export function itemListFromDB(items: ItemDB[] | null | undefined): Item[] {
  if (!items) return [];
  return items.map(itemFromDB);
}
