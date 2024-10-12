import { prisma } from "@/prisma";
import { ProductCategory } from "@prisma/client";

export async function getCategoryList(
  isForAdmin: boolean,
): Promise<ProductCategory[]> {
  const whereQuery: any = isForAdmin ? {} : { isActive: true };
  return await prisma.productCategory.findMany({ where: whereQuery });
}
