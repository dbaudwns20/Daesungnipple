/**
 * 상품 이미지
 * @property {number} id - 이미지 ID
 * @property {string} productId - 상품 ID
 * @property {Date} createdAt - 생성일
 * @property {string} url - 이미지 URL
 * @property {number} viewOrder - 이미지 순서, 0부터 앞 순서
 */
export type ProductImage = {
  id: number; // 이미지 ID
  productId: string; // 상품 ID

  createdAt: Date; // 생성일

  url: string; // 이미지 URL
  viewOrder: number; // 이미지 순서
};

/**
 * DB 상품 이미지 생성을 위한 데이터 만들기
 * @param productId 상품 아이디
 * @param url 이미지 URL
 * @param viewOrder 이미지 순서
 * @returns any
 */
export function dataFromProductImage(
  productId: string,
  url: string,
  viewOrder: number,
): any {
  return {
    productId: productId,
    url: url.trim(),
    viewOrder: viewOrder,
  };
}
