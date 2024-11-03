// import { NextRequest, NextResponse } from "next/server";
// import type { ProductCategory, ProductCategoryListOption } from "@/types";
// import { listCategory } from "@/services/category.service";
//
// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams;
//   const listOption: ProductCategoryListOption = {
//     ids: searchParams.get("id") ? [ parseInt(searchParams.get("id") || "0", 10) ] : null,
//     name: searchParams.get("name") || "",
//     isActive: searchParams.get("isActive") ? searchParams.get("isActive") === "true" : null
//   };
//   try {
//     let res = await listCategory(listOption);
//     if (!res) res = { list: [], totalCount: 0 };
//
//     return NextResponse.json(
//       {
//         message: "조회되었습니다.",
//         data: res
//       },
//       { status: 200 }
//     );
//   } catch (e: any) {
//     return NextResponse.json({ message: e.message }, { status: 500 });
//   }
// }
