import type { Product } from "@/types/product";

export type Manufacturer = {
  id: number;
  name: string; // 제조사명
  siteUrl: string; // 제조사 홈페이지 링크
  createdAt: Date | null;
  products: Product[];
}