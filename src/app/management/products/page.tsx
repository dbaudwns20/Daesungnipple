"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/button";

export default function ProductsPage() {
  const router = useRouter();

  const goNew = () => {
    router.push("/management/products/new");
  };

  return (
    <>
      <header className="mb-1.5 flex h-8 items-center justify-between">
        <h1 className="font-bold text-gray-600">상품 관리</h1>
        <div className="flex gap-1">
          <Button type="button" color="blue" size="xs" onClick={goNew}>
            상품 추가
          </Button>
        </div>
      </header>
    </>
  );
}
