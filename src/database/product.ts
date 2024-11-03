// import { prisma } from "@/prisma";
// import type {
//   Product,
//   ProductImage,
//   ProductDetailImage,
//   ProductOption,
//   ProductListOption
// } from "@/types";
// import {
//   bindFrom,
//   dataFromProduct,
//   dataFromProductDetailImage,
//   dataFromProductImage,
//   dataFromProductOption,
//   productFromDB,
//   productListFromDB,
//   getProductListOptionAsCondition
// } from "@/types";
//
//
// /**
//  * DB에 상품 만들기
//  * @param product
//  * @returns void
//  */
// export async function createProductDB(product: Product) {
//   await prisma.$transaction(async (tx) => {
//     // 상품 만들기
//     const newProduct = await tx.product.create({
//       data: dataFromProduct(product)
//     });
//
//     // 이미지 생성
//     const images: ProductImage[] = product.images;
//     // 지정된 이미지가 하나라도 있으면 만들기
//     if (images && images.length > 0) {
//       for (let i = 0; i < images.length; i++) {
//         // viewOrder(이미지 순서) 는 0부터 시작해서 1씩 증가
//         await tx.productImage.create({
//           data: dataFromProductImage(newProduct.id, images[i].url, i)
//         });
//       }
//       // 또는 대표 이미지 url 이 빈값이 아니면 그걸로 만들기
//     } else if (product.mainImageUrl && product.mainImageUrl.trim() !== "") {
//       await tx.productImage.create({
//         data: dataFromProductImage(newProduct.id, product.mainImageUrl, 0)
//       });
//     }
//
//     // 상세설명 이미지 생성
//     const detailImages: ProductDetailImage[] = product.detailImages;
//     // 지정된 상세설명 이미지가 하나라도 있으면 만들기
//     if (detailImages && detailImages.length > 0) {
//       for (let i = 0; i < detailImages.length; i++) {
//         // viewOrder(이미지 순서) 는 0부터 시작해서 1씩 증가
//         await tx.productDetailImage.create({
//           data: dataFromProductDetailImage(newProduct.id, detailImages[i].url, i)
//         });
//       }
//     }
//
//     // 상품 옵션 생성
//     const options: ProductOption[] = product.options;
//     // 지정된 상품 옵션이 하나라도 있으면 만들기
//     if (options && options.length > 0) {
//       for (let i = 0; i < options.length; i++) {
//         await tx.productOption.create({
//           data: dataFromProductOption(newProduct.id, options[i])
//         });
//       }
//     }
//   });
// }
//
// /**
//  * DB에 상품 수정하기
//  * @param product
//  * @returns Product
//  */
// export async function updateProductDB(product: Product): Promise<Product> {
//   await prisma.$transaction(async (tx) => {
//     // 상품 수정하기
//     await tx.product.update({
//       where: { id: product.id },
//       data: dataFromProduct(product)
//     });
//
//     // 이미지 수정, 삭제 => 새로 생성
//     await tx.productImage.deleteMany({ where: { productId: product.id } });
//     const images: ProductImage[] = product.images;
//     // 지정된 이미지가 하나라도 있으면 만들기
//     if (images && images.length > 0) {
//       const newImages: ProductImage[] = [];
//       for (let i = 0; i < images.length; i++) {
//         // viewOrder(이미지 순서) 는 0부터 시작해서 1씩 증가
//         const newImage = await tx.productImage.create({
//           data: dataFromProductImage(product.id, images[i].url, i)
//         });
//         // 변경된 이미지를 리턴하기 위해서 배열에 추가
//         newImages.push(bindFrom<ProductImage>(newImage));
//       }
//       // 변경된 이미지 배열로 대체
//       product.images = newImages;
//
//       // 또는 대표 이미지 url 이 빈값이 아니면 그걸로 만들기
//     } else if (product.mainImageUrl && product.mainImageUrl.trim() !== "") {
//       const newImage = await tx.productImage.create({
//         data: dataFromProductImage(product.id, product.mainImageUrl, 0)
//       });
//       // 변경된 이미지 대표 이미지로 설정
//       product.images = [ bindFrom<ProductImage>(newImage) ];
//     }
//
//     // 상세설명 이미지 수정, 삭제 => 새로 생성
//     await tx.productDetailImage.deleteMany({ where: { productId: product.id } });
//     const detailImages: ProductDetailImage[] = product.detailImages;
//     // 지정된 상세설명 이미지가 하나라도 있으면 만들기
//     if (detailImages && detailImages.length > 0) {
//       const newDetailImages: ProductDetailImage[] = [];
//       for (let i = 0; i < detailImages.length; i++) {
//         // viewOrder(이미지 순서) 는 0부터 시작해서 1씩 증가
//         const newDetailImage = await tx.productDetailImage.create({
//           data: dataFromProductDetailImage(product.id, detailImages[i].url, i)
//         });
//         // 변경된 이미지를 리턴하기 위해서 배열에 추가
//         newDetailImages.push(bindFrom<ProductDetailImage>(newDetailImage));
//       }
//       // 변경된 이미지 배열로 대체
//       product.detailImages = newDetailImages;
//     }
//
//     // 상품 옵션 수정, 삭제 => 새로 생성
//     await tx.productOption.deleteMany({ where: { productId: product.id } });
//     const options: ProductOption[] = product.options;
//     // 지정된 상품 옵션이 하나라도 있으면 만들기
//     if (options && options.length > 0) {
//       const newOptions: ProductOption[] = [];
//       for (let i = 0; i < options.length; i++) {
//         const newOption = await tx.productOption.create({
//           data: dataFromProductOption(product.id, options[i])
//         });
//         // 변경된 옵션을 리턴하기 위해서 배열에 추가
//         newOptions.push(bindFrom<ProductOption>(newOption));
//       }
//       // 변경된 옵션 배열로 대체
//       product.options = newOptions;
//     }
//   });
//
//   return product;
// }
//
// /**
//  * DB에 상품 소프트 삭제
//  * @param id
//  * @returns void
//  */
// export async function softDeleteProductDB(id: string) {
//   await prisma.product.update({
//     where: { id: id },
//     data: { exposedAt: null, deletedAt: new Date() }
//   });
// }
//
// /**
//  * DB에 상품 하드 삭제
//  * @param id
//  * @returns void
//  */
// export async function hardDeleteProductDB(id: string) {
//   await prisma.$transaction(async (tx) => {
//     // 상품 삭제
//     await tx.product.delete({ where: { id: id } });
//     // 이미지 삭제
//     await tx.productImage.deleteMany({ where: { productId: id } });
//     // 상세설명 이미지 삭제
//     await tx.productDetailImage.deleteMany({ where: { productId: id } });
//     // 상품 옵션 삭제
//     await tx.productOption.deleteMany({ where: { productId: id } });
//   });
// }
//
// /**
//  * 아무 조건 없이 상품 조회
//  * @param where 검색 조건
//  * @returns Product | null
//  */
// export async function getProductDB(where: any): Promise<Product | null> {
//   const res = await prisma.product.findFirst({
//     where: where,
//     include: {
//       images: true,
//       detailImages: true,
//       options: true,
//       manufacturer: true,
//       category: true
//     }
//   });
//   return productFromDB(res);
// }
//
// /**
//  * 상품 리스트 조회
//  * @param opt
//  * @returns Product[]
//  */
// export async function listProductDB(opt: ProductListOption): Promise<Product[]> {
//   const res = await prisma.product.findMany({
//     where: getProductListOptionAsCondition(opt),
//     orderBy: { createdAt: "desc" },
//     skip: (opt.page - 1) * opt.unit,
//     take: opt.unit,
//     // relations
//     include: {
//       // 제조사 조회
//       manufacturer: true,
//       // 카테고리 조회
//       category: true
//     }
//   });
//   return productListFromDB(res);
// }
//
// /**
//  * 상품 총 개수 조회
//  * @param opt
//  * @returns number
//  */
// export async function countProductDB(opt: ProductListOption): Promise<number> {
//   return prisma.product.count({ where: getProductListOptionAsCondition(opt) });
// }
