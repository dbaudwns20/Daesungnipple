"use server";

import { createItem, updateItem, deleteItems } from "@/services/item.service";
import { ActionResponse, Item } from "@/types";

export async function CreateItem(newItem: Item) {
  const response: ActionResponse = {
    ok: true,
    message: "생성되었습니다",
  };
  try {
    await createItem(newItem);
  } catch (e: any) {
    response.ok = false;
    response.message = e.message;
  } finally {
    return response;
  }
}
