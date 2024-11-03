/**
 * 상품 구매 옵션
 * @property {number} id - 옵션 ID
 * @property {string} productId - 상품 ID
 * @property {number | null} itemId - 물건 ID
 * @property {Date} createdAt - 생성일
 * @property {Date} updatedAt - 수정일
 * @property {string} name - 옵션명
 * @property {number} price - 옵션 추가 가격
 * @property {boolean} isDefault - 기본 옵션 여부
 * @property {number} viewOrder - 옵션 순서
 */
export type ProductOption = {
  id: number; // 옵션 ID
  productId: string; // 상품 ID
  itemId: number | null; // 물건 ID

  createdAt: Date; // 생성일
  updatedAt: Date; // 수정일

  name: string; // 옵션명
  price: number; // 옵션 추가 가격
  isDefault: boolean; // 기본 옵션 여부
  viewOrder: number; // 옵션 순서
}

/**
 * DB 상품 옵션 생성을 위한 데이터 만들기
 * @param option
 * @returns any
 */
export function dataFromProductOption(option: ProductOption): any {
  return {
    productId: option.productId,
    itemId: option.itemId,
    name: option.name.trim(),
    price: option.price,
    isDefault: option.isDefault,
    viewOrder: option.viewOrder
  };
}
