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
}

/**
 * DB 상품 이미지 생성을 위한 데이터 만들기
 * @param productId 상품 아이디
 * @param url 이미지 URL
 * @param viewOrder 이미지 순서
 * @returns any
 */
export function dataFromProductImage(productId: string, url: string, viewOrder: number): any {
  return {
    productId: productId,
    url: url.trim(),
    viewOrder: viewOrder
  };
}

// /**
//  * DB 상품 이미지 데이터를 ProductImage로 변환
//  * @param productImage
//  * @returns ProductImage
//  */
// export function productImageFromDB(productImage: ProductImageDB): ProductImage {
//   return {
//     id: productImage.id,
//     productId: productImage.productId,
//     createdAt: productImage.createdAt,
//     url: productImage.url,
//     viewOrder: productImage.viewOrder
//   } as ProductImage;
// }
//
// /**
//  * DB 상품 이미지 데이터 배열을 ProductImage 배열로 변환
//  * @param productImages
//  * @returns ProductImage[]
//  */
// export function productImageListFromDB(productImages: ProductImageDB[] | null | undefined): ProductImage[] {
//   if (!productImages) return [];
//   return productImages.map((it: ProductImageDB) => productImageFromDB(it));
// }

/**
 * 상품 상세설명 이미지
 * @property {number} id - 이미지 ID
 * @property {string} productId - 상품 ID
 * @property {Date} createdAt - 생성일
 * @property {string} url - 이미지 URL
 * @property {number} viewOrder - 이미지 순서, 0부터 앞 순서
 */
export type ProductDetailImage = {
  id: number; // 이미지 ID
  productId: string; // 상품 ID
  createdAt: Date; // 생성일
  url: string; // 이미지 URL
  viewOrder: number; // 이미지 순서
}

/**
 * DB 상품 상세설명 이미지 생성을 위한 데이터 만들기
 * @param productId 상품 아이디
 * @param url 이미지 URL
 * @param viewOrder 이미지 순서
 * @returns any
 */
export function dataFromProductDetailImage(productId: string, url: string, viewOrder: number): any {
  return {
    productId: productId,
    url: url.trim(),
    viewOrder: viewOrder
  };
}

// /**
//  * DB 상품 상세설명 이미지 데이터를 ProductDetailImage로 변환
//  * @param productDetailImage
//  * @returns ProductDetailImage
//  */
// export function productDetailImageFromDB(productDetailImage: ProductDetailImageDB): ProductDetailImage {
//   return {
//     id: productDetailImage.id,
//     productId: productDetailImage.productId,
//     createdAt: productDetailImage.createdAt,
//     url: productDetailImage.url,
//     viewOrder: productDetailImage.viewOrder
//   } as ProductDetailImage;
// }
//
// /**
//  * DB 상품 상세설명 이미지 데이터 배열을 ProductDetailImage 배열로 변환
//  * @param productDetailImages
//  * @returns ProductDetailImage[]
//  */
// export function productDetailImageListFromDB(productDetailImages: ProductDetailImageDB[] | null | undefined): ProductDetailImage[] {
//   if (!productDetailImages) return [];
//   return productDetailImages.map((it: ProductDetailImageDB) => productDetailImageFromDB(it));
// }