import { prisma } from "@/prisma";
import { bindFrom, bindFromArray } from "@/types/bind";
import { validateListOption } from "@/types/sarch.option";
import type {
  Product,
  ProductImage,
  ProductDetailImage,
  ProductOption,
  ProductListOption
} from "@/types/product";
import {
  dataFromProduct,
  dataFromProductImage,
  dataFromProductDetailImage,
  dataFromProductOption
} from "@/types/product";

/**
 * 상품 만들기
 * @param product
 * @returns void
 */
export async function createProduct(product: Product | null) {
  if (!product) throw new Error("상품 정보가 없습니다.");
  try {
    await prisma.$transaction(async (tx) => {
      // 상품 만들기
      const newProduct = await tx.product.create({
        data: dataFromProduct(product)
      });

      // 이미지 생성
      const images: ProductImage[] = product.images;
      if (images) {
        for (let i = 0; i < images.length; i++) {
          await tx.productImage.create({
            data: dataFromProductImage(newProduct.id, images[i].url, i)
          });
        }
      } else if (product.mainImageUrl) {
        await tx.productImage.create({
          data: dataFromProductImage(newProduct.id, product.mainImageUrl, 0)
        });
      }

      // 상세설명 이미지 생성
      const detailImages: ProductDetailImage[] = product.detailImages;
      if (detailImages) {
        for (let i = 0; i < detailImages.length; i++) {
          await tx.productDetailImage.create({
            data: dataFromProductDetailImage(newProduct.id, detailImages[i].url, i)
          });
        }
      }

      // 상품 옵션 생성
      const options: ProductOption[] = product.options;
      if (options) {
        for (let i = 0; i < options.length; i++) {
          await tx.productOption.create({
            data: dataFromProductOption(newProduct.id, options[i])
          });
        }
      }
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 상품 수정하기
 * @param product
 * @returns Product
 */
export async function updateProduct(product: Product | null): Promise<Product> {
  if (!product) throw new Error("상품 정보가 없습니다.");
  try {
    await prisma.$transaction(async (tx) => {
      // 상품 수정하기
      await tx.product.update({
        where: { id: product.id },
        data: dataFromProduct(product)
      });

      // 이미지 수정, 삭제 => 새로 생성
      await tx.productImage.deleteMany({ where: { productId: product.id } });
      const images: ProductImage[] = product.images;
      if (images) {
        const newImages: ProductImage[] = [];
        for (let i = 0; i < images.length; i++) {
          const newImage = await tx.productImage.create({
            data: dataFromProductImage(product.id, images[i].url, i)
          });
          newImages.push(newImage);
        }
        product.images = newImages;
      } else if (product.mainImageUrl) {
        const newImage = await tx.productImage.create({
          data: dataFromProductImage(product.id, product.mainImageUrl, 0)
        });
        product.images = [ newImage ];
      }

      // 상세설명 이미지 수정, 삭제 => 새로 생성
      await tx.productDetailImage.deleteMany({ where: { productId: product.id } });
      const detailImages: ProductDetailImage[] = product.detailImages;
      if (detailImages) {
        const newDetailImages: ProductDetailImage[] = [];
        for (let i = 0; i < detailImages.length; i++) {
          const newDetailImage = await tx.productDetailImage.create({
            data: dataFromProductDetailImage(product.id, detailImages[i].url, i)
          });
          newDetailImages.push(newDetailImage);
        }
        product.detailImages = newDetailImages;
      }

      // 상품 옵션 수정, 삭제 => 새로 생성
      await tx.productOption.deleteMany({ where: { productId: product.id } });
      const options: ProductOption[] = product.options;
      if (options) {
        const newOptions: ProductOption[] = [];
        for (let i = 0; i < options.length; i++) {
          const newOption = await tx.productOption.create({
            data: dataFromProductOption(product.id, options[i])
          });
          newOptions.push(newOption);
        }
        product.options = newOptions;
      }
    });
    return product;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 상품 삭제하기
 * @param id
 * @param hardDelete (default: false)
 * @returns void
 */
export async function deleteProduct(id: number, hardDelete: boolean = false) {
  try {
    await prisma.$transaction(async (tx) => {
      // 상품 삭제하기
      if (!hardDelete) {
        // @ts-ignore
        await tx.product.softDelete({ id: id });
      } else {
        // 상품 삭제
        await tx.product.delete({ where: { id: id } });
        // 이미지 삭제
        await tx.productImage.deleteMany({ where: { productId: id } });
        // 상세설명 이미지 삭제
        await tx.productDetailImage.deleteMany({ where: { productId: id } });
        // 상품 옵션 삭제
        await tx.productOption.deleteMany({ where: { productId: id } });
      }
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 상품 조회하기
 * @param id
 * @param allowDeleted (default: false)
 * @returns Product
 */
export async function getProduct(id: number, allowDeleted: boolean = false): Promise<Product> {
  try {
    let where: any = { AND: [ { id: id }, { deletedAt: null } ] };
    if (allowDeleted) {
      where = { id: id };
    }
    const res = await prisma.product.findFirst({ where: where });
    return bindFrom<Product>(res);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 상품 리스트 조회하기
 * @param opt
 * @returns Product[]
 */
export async function listProduct(opt: ProductListOption): Promise<Product[]> {
  try {
    const validatedOption = validateListOption<ProductListOption>(opt);
    if (validatedOption.categoryId) {
      return listCategorizedProduct(validatedOption);
    } else {
      return listNotCategorizedProduct(validatedOption);
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * 카테고리를 검색 키워드로 하는 경우
 * @param opt
 * @returns Product[]
 */
async function listCategorizedProduct(opt: ProductListOption): Promise<Product[]> {
  /*
  // @ts-ignore
      res = await prisma.product.$queryRaw`
          WITH RECURSIVE CategoryHierarchy AS (SELECT id, parent_id
                                               FROM product_category
                                               WHERE id = ${ categoryId }
                                                 AND deleted_at IS NULL
                                               UNION ALL
                                               SELECT c.id, c.parent_id
                                               FROM product_category c
                                                        INNER JOIN CategoryHierarchy ch ON c.parent_id = ch.id) AND c.deleted_at IS NULL
          SELECT p.*
          FROM tbl_product AS p
          WHERE p.category_id IN (SELECT id FROM CategoryHierarchy)
            AND p.deleted_at IS NULL
          ORDER BY ${ opt.orderBy } ${ opt.orderDirection }
          LIMIT ${ opt.unit }
          OFFSET ${ (opt.page - 1) * opt.unit };
      `;
   */
  return [] as Product[];
}

/**
 * 카테고리를 검색 키워드로 하지 않는 경우
 * @param opt
 * @returns Product[]
 */
async function listNotCategorizedProduct(opt: ProductListOption): Promise<Product[]> {
  let where: any = { deletedAt: null };
  if (opt.name && opt.name !== "") {
    where = { AND: [ { name: { contains: opt.name } }, { deletedAt: null } ] };
  }
  /*
  const res = await prisma.product.$queryRaw`
          SELECT *
          FROM product
          WHERE deleted_at IS NULL
          ORDER BY ${ opt.orderBy } ${ opt.orderDirection }
          LIMIT ${ opt.unit }
          OFFSET ${ (opt.page - 1) * opt.unit };
      `;
   */
  const res = await prisma.product.findMany({
    where: where,
    orderBy: { createdAt: "desc" },
    skip: (opt.page - 1) * opt.unit,
    take: opt.unit,
    // relations
    include: {
      // 상품 이미지 함께 조회
      images: {
        select: {
          url: true // url 만 조회
        },
        where: { viewOrder: 0 } // 대표 이미지만 조회
      },
      // 제조사 조회
      manufacturer: {
        select: {
          name: true // 제조사명만 조회
        },
        where: { deletedAt: null } // 삭제되지 않은 제조사만 조회
      },
      category: {
        select: {
          name: true // 카테고리명만 조회
        }
      }
    }
  });
  return bindFromArray<Product>(res);
}