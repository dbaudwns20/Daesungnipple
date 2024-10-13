"use server";

import type { Product } from "@/types/product";
import { createProduct } from "@/services/product.service";

type ProductActionResponse = {
  ok: boolean;
  message: string;
  data?: any;
};

export async function CreateProductAction(formData: FormData) {
  let { ok, message } = { ok: true, message: "상품이 등록되었습니다." };
  try {
    const productJSON = formData.get("product") as string;
    const productObj = JSON.parse(productJSON) as Product;
    console.log(productObj);
    await createProduct(productObj);
  } catch (e: any) {
    ok = false;
    message = e.message;
  }
  return {
    ok,
    message,
  } as ProductActionResponse;
}
