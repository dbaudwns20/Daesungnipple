import type { Item, ItemSearchOption } from "@/types";
import {
  getItemDB,
  listItemsDB,
  createItemDB,
  updateItemDB,
  deleteItemsDB,
} from "@/database/item";

export async function getItem(id: number): Promise<Item | null> {
  return await getItemDB(id);
}

export async function listItems(
  opt: ItemSearchOption,
): Promise<{ list: Item[]; totalCount: number }> {
  return await listItemsDB(opt);
}

export async function createItem(item: Item | null): Promise<Item> {
  if (!item) throw new Error("잘못된 요청입니다");
  return await createItemDB(item);
}

export async function updateItem(item: Item | null): Promise<Item> {
  if (!item) throw new Error("잘못된 요청입니다");
  return await updateItemDB(item);
}

export async function deleteItems(ids: number[]) {
  if (!ids || ids.length < 1) throw new Error("잘못된 요청입니다");
  await deleteItemsDB(ids);
}
