"use server";

import { deleteCategory } from "@/services/category.service";
import type { ActionResponse } from "@/types";

/**
 * 카테고리 제거
 * @param categoryId
 */
export async function DeleteCategory(categoryId: number) {
  let response: ActionResponse = {
    ok: true,
    message: "삭제되었습니다.",
  };
  try {
    if (!categoryId || isNaN(categoryId))
      throw new Error("카테고리가 유요하지 않습니다.");

    await deleteCategory(categoryId);
  } catch (e: any) {
    response.ok = false;
    response.message = e.message;
  } finally {
    return response;
  }
}
