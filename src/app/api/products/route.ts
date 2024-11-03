"use server";

import { NextRequest, NextResponse } from "next/server";

import type { ProductListOption } from "@/types";
import { ListAliveOption } from "@/types";
import { countProduct, listProduct } from "@/services/product.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const listOption: ProductListOption = {
    name: searchParams.get("name") || "",
    categoryId: searchParams.get("categoryId")
      ? parseInt(searchParams.get("categoryId") || "0", 10)
      : null,
    page: parseInt(searchParams.get("page") || "1", 10), // 기본값 1
    unit: parseInt(searchParams.get("unit") || "10", 10), // 기본값 10
    listAliveOption: ListAliveOption.ALIVE
  };

  // TODO isLoading 테스트
  // await delay(3000)

  let list = await listProduct(listOption);
  if (!list) list = [];
  const totalCount = await countProduct(listOption);
  for (let product of list) {
    console.log(product);
  }
  console.log("totalCount", totalCount);
  return NextResponse.json(list);
}
