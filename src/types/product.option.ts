/**
 * 상품 구매 옵션
 * @property {number} id - 옵션 ID
 * @property {string} productId - 상품 ID
 * @property {Date} createdAt - 생성일
 * @property {string} name - 옵션명
 * @property {number} price - 옵션 추가 가격
 * @property {number} stockCount - 재고 수량, 0 이면 무제한 -1이면 품절, 1이상이면 해당 수량만큼 재고
 * @property {boolean} isDefault - 기본 옵션 여부
 * @property {number} viewOrder - 옵션 순서
 */
export type ProductOption = {
  id: number; // 옵션 ID
  productId: string; // 상품 ID
  createdAt: Date; // 생성일
  name: string; // 옵션명
  price: number; // 옵션 추가 가격
  stockCount: number; // TODO 고민 => 재고 수량, 0 이면 무제한 -1이면 품절, 1이상이면 해당 수량만큼 재고
  isDefault: boolean; // 기본 옵션 여부
  viewOrder: number; // 옵션 순서
}

/**
 * DB 상품 옵션 생성을 위한 데이터 만들기
 * @param productId 상품 아이디
 * @param option
 * @returns any
 */
export function dataFromProductOption(productId: string, option: ProductOption): any {
  return {
    productId: productId,
    name: option.name.trim(),
    price: option.price,
    stockCount: option.stockCount,
    isDefault: option.isDefault,
    viewOrder: option.viewOrder
  };
}

// /**
//  * DB 상품 옵션 데이터를 ProductOption로 변환
//  * @param productOption
//  * @returns ProductOption
//  */
// export function productOptionFromDB(productOption: ProductOptionDB): ProductOption {
//   return {
//     id: productOption.id,
//     productId: productOption.productId,
//     createdAt: productOption.createdAt,
//     name: productOption.name,
//     price: productOption.price,
//     stockCount: productOption.stockCount,
//     isDefault: productOption.isDefault,
//     viewOrder: productOption.viewOrder
//   } as ProductOption;
// }
//
// /**
//  * DB 상품 옵션 데이터 배열을 ProductOption 배열로 변환
//  * @param productOptions
//  * @returns ProductOption[]
//  */
// export function productOptionListFromDB(productOptions: ProductOptionDB[] | null | undefined): ProductOption[] {
//   if (!productOptions) return [];
//   return productOptions.map((it: ProductOptionDB) => productOptionFromDB(it));
// }