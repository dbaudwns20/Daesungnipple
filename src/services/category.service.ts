import { prisma } from "@/prisma";

import {
  type ProductCategoryForAdmin,
  bindProductCategoryListForAdmin,
} from "@/types/product.category";

export async function getCategoryList(
  isForAdmin: boolean,
): Promise<ProductCategoryForAdmin[]> {
  const whereQuery: object = isForAdmin ? {} : { isActive: true };

  const list = await prisma.productCategory.findMany({
    where: whereQuery,
    orderBy: [{ parentId: "asc" }, { viewOrder: "asc" }],
  });

  return isForAdmin ? bindProductCategoryListForAdmin(list) : [];
}
