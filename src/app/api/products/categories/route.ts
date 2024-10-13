import { NextRequest, NextResponse } from "next/server";

import { type ProductCategoryForAdmin } from "@/types/product.category";

import { getCategoryList } from "@/services/category.service";

export async function GET(request: NextRequest) {
  let list: ProductCategoryForAdmin[] = [];
  try {
    // TODO 토큰이나 인증 값 같은 걸로 호출자가 어드민인지 확인 필요
    const isForAdmin = true;

    list = await getCategoryList(isForAdmin);
    return NextResponse.json(
      {
        message: "조회되었습니다.",
        list,
      },
      { status: 200 },
    );
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
