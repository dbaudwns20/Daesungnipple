import { NextRequest, NextResponse } from "next/server";

import { ProductCategory } from "@prisma/client";

import { getCategoryList } from "@/services/category.service";

export async function GET(request: NextRequest) {
  let list: ProductCategory[] = [];
  try {
    // TODO 토큰이나 인증 값 같은 걸로 호출자가 어드민인지 확인 필요
    const isForAdmin = true;

    list = await getCategoryList(isForAdmin);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  } finally {
    return NextResponse.json(
      {
        message: "retrieved",
        list,
      },
      { status: 200 },
    );
  }
}
