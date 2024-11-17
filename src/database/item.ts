import { prisma } from "@/prisma";

import type { Item, ItemImage, ItemSearchOption } from "@/types";
import {
  bindFromArray,
  dataFromItem,
  dataFromItemImage,
  itemFromDB,
  itemListFromDB,
} from "@/types";

export async function getItemDB(id: number): Promise<Item | null> {
  try {
    const res = await prisma.item.findUnique({
      where: { id: id },
      include: { images: true },
    });

    if (!res) return null;

    return itemFromDB(res);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function listItemsDB(
  opt: ItemSearchOption,
): Promise<{ list: Item[]; totalCount: number }> {
  try {
    const where = {
      deletedAt: null,
    };

    const [totalCount, items] = await prisma.$transaction([
      prisma.item.count({
        where,
      }),
      prisma.item.findMany({
        where,
        take: opt.unit,
        skip: (opt.page - 1) * opt.unit,
        orderBy: { createdAt: "desc" },
        include: {
          images: true,
        },
      }),
    ]);

    return {
      list: items ? itemListFromDB(items) : [],
      totalCount,
    };
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function createItemDB(item: Item): Promise<Item> {
  try {
    await prisma.$transaction(async (tx) => {
      // 이미지 빼놓기
      const images = item.images;
      // 물건 생성
      const itemRes = await tx.item.create({ data: dataFromItem(item) });
      // 생성된 아이템 가져오기
      item = itemFromDB(itemRes);
      // 새 이미지 생성
      if (images && images.length > 0) {
        let newImages = [];
        for (let i = 0; i < images.length; i++) {
          newImages.push(dataFromItemImage(itemRes.id, images[i].url, i));
        }
        const imageRes = await tx.itemImage.createMany({ data: newImages });
        // 새로운 아이템 이미지 바인딩
        item.images = bindFromArray<ItemImage>(imageRes);
      }
    });
    return item;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function updateItemDB(item: Item): Promise<Item> {
  try {
    await prisma.$transaction(async (tx) => {
      // 이미지 빼놓기
      const images = item.images;
      // 물건 수정
      const itemRes = await tx.item.update({
        where: { id: item.id },
        data: dataFromItem(item),
      });
      // 수정된 아이템 가져오기
      item = itemFromDB(itemRes);
      // 기존 이미지 전부 삭제하기
      await tx.itemImage.deleteMany({ where: { itemId: item.id } });
      // 새 이미지 생성
      if (images && images.length > 0) {
        let newImages = [];
        for (let i = 0; i < images.length; i++) {
          newImages.push(dataFromItemImage(itemRes.id, images[i].url, i));
        }
        const imageRes = await tx.itemImage.createMany({ data: newImages });
        // 새로운 아이템 이미지 바인딩
        item.images = bindFromArray<ItemImage>(imageRes);
      }
    });
    return item;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function deleteItemsDB(ids: number[]) {
  try {
    await prisma.$transaction(async (tx) => {
      // 물건 이미지 전부 삭제하기
      await tx.itemImage.deleteMany({ where: { itemId: { in: ids } } });

      // 물건 전부 삭제하기
      await tx.item.deleteMany({ where: { id: { in: ids } } });

      // TODO: 물건 삭제했을 때 더 처리할게 있다면 함께 처리하기
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}
