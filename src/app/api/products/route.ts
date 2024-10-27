"use server";

import { NextRequest, NextResponse } from "next/server";
import type { ProductListOption } from "@/types";
import { SearchOption } from "@/types";
import { listProduct } from "@/services/product.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const listOption: ProductListOption = {
    name: searchParams.get("name") || "",
    categoryIds: searchParams.get("categoryId")
      ? [ parseInt(searchParams.get("categoryId") || "0", 10) ]
      : null,
    page: parseInt(searchParams.get("page") || "1", 10), // 기본값 1
    unit: parseInt(searchParams.get("unit") || "10", 10), // 기본값 10
    searchOption: SearchOption.ALL
  };

  try {
    // TODO isLoading 테스트
    // await delay(3000)

    let res = await listProduct(listOption);
    if (!res) res = { list: [], totalCount: 0 };

    return NextResponse.json({
      message: "조회되었습니다.",
      data: res
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
