"use server";

import { NextRequest, NextResponse } from "next/server";

import type { ProductListOption } from "@/types/product";
import { listProduct } from "@/services/product.service";
import { delay } from "@/utils/common";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const listOption: ProductListOption = {
    name: searchParams.get("name") || "",
    categoryId: searchParams.get("categoryId")
      ? parseInt(searchParams.get("categoryId") || "0", 10)
      : null,
    page: parseInt(searchParams.get("page") || "1", 10), // 기본값 1
    unit: parseInt(searchParams.get("unit") || "10", 10), // 기본값 10
  };

  // TODO isLoading 테스트
  // await delay(3000)

  let list = await listProduct(listOption);
  if (!list) list = [];

  return NextResponse.json(list);
}
