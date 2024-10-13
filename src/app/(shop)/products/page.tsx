"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/types";
import useFetch from "@/hooks/fetch";
import { showToast } from "@/utils/message";
import Button from "@/components/button";
import { addComma } from "@/utils/common";

export default function Products() {
  const router = useRouter();
  // URL 파라미터 가져오기
  const searchParams = useSearchParams();
  // URL 파라미터를 쿼리스트링으로 만들기
  const newSearchParams = new URLSearchParams({
    page: searchParams.get("page") || "1", // 페이지 번호
    unit: searchParams.get("unit") || "1000", // 페이지 단위
    // exposed: searchParams.get("exposed") || "true" // 노출 여부
  });
  // TODO 페이지네이션 구현
  // 상품 목록
  let products: Product[] = [];
  const setProducts = (data: Product[]) => {
    for (const product of data) {
      products.push(product);
    }
  };
  // 페이지 렌더링시 상품목록 가져오기
  const { data, error, isLoading } = useFetch(
    `/api/products?${newSearchParams.toString()}`,
  );
  // TODO if (isLoading) return <div>Loading...</div>;
  if (error) showToast({ message: error.message });
  else if (data) setProducts(data);

  // 페이지가 변경될 때마다 다시 데이터를 패칭하는 로직
  // const fetchData = async () => {
  //   newSearchParams.set("page", searchParams.get("page") || "1");
  //   newSearchParams.set("unit", searchParams.get("unit") || "10");
  //   const res = await fetch(`/api/products?${ newSearchParams.toString() }`);
  //   const data = await res.json();
  //   if (data) setProducts(data);
  //   console.log("data", data);
  // };

  const dummyImage = "https://dummyimage.com/300x300/000/fff";

  // TODO exposed 를 기준으로 탭 구현, 상품을 만들고 노출은 아직 안하고 싶은 것들
  return (
    <div className="flex w-full flex-col space-y-4 bg-blue-200 p-2">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">상품 목록</h1>
        <Button
          type="button"
          onClick={async () => {
            await router.replace("/products/generate");
          }}
        >
          등록하기
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex w-full flex-row space-x-2 bg-gray-200"
          >
            <Link href={`/products/${product.id}`}>
              <img
                src={product.mainImageUrl || dummyImage}
                className="h-[250px] max-w-[250px]"
                alt={"상품 이미지"}
              ></img>
            </Link>
            <div className="flex flex-col items-center text-lg font-bold">
              <p>{product.name}</p>
              <p>{product.modelName || ""}</p>
              <p className="text-blue-600">{addComma(product.price)} 원</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
