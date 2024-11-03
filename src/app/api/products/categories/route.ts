import { NextRequest, NextResponse } from "next/server";
import type { ProductCategory } from "@/types";
import { listCategory } from "@/services/category.service";

export async function GET(request: NextRequest) {
  let list: ProductCategory[] = [];
  try {
    // TODO 토큰이나 인증 값 같은 걸로 호출자가 어드민인지 확인 필요
    const isForAdmin = true;

    list = await listCategory();
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
