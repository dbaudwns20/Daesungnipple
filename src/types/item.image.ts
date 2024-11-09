/**
 * 물건 이미지 데이터
 * @property {number} id - 이미지 ID(=Prisma)
 * @property {number} itemId - 물건 ID(=Prisma)
 * @property {Date} createdAt - 생성일(=Prisma)
 * @property {string} url - 이미지 URL(=Prisma)
 * @property {number} viewOrder - 이미지 순서(=Prisma)
 */
export type ItemImage = {
  id: number; // 이미지 ID
  itemId: number; // 물건 ID

  createdAt: Date; // 생성일

  url: string; // 이미지 URL
  viewOrder: number; // 이미지 순서
}

/**
 * DB 물건 이미지 생성, 수정을 위한 데이터 만들기
 * @param itemId 물건 아이디
 * @param url 이미지 URL
 * @param viewOrder 이미지 순서
 */
export function dataFromItemImage(itemId: number, url: string, viewOrder: number): any {
  return {
    itemId: itemId,
    url: url.trim(),
    viewOrder: viewOrder
  };
}
