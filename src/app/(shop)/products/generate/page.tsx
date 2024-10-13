"use client";

import {
  useState,
  useRef,
  useEffect,
  useTransition,
  FormEvent,
  ChangeEvent,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import InputObject from "@/components/input/input.object";
import Button, { type ButtonType } from "@/components/button";
import { NOT_EMPTY_RULE, validateForm } from "@/utils/validator";
import type { Product } from "@/types/product";
import { initProduct } from "@/types/product";
import { showToast } from "@/utils/message";
import { CreateProductAction } from "@/actions/product.actions";

export default function ProductGenerate() {
  const router = useRouter();
  // 새로 만들 상품 객체
  const [product, setProduct] = useState<Product>(initProduct());
  // 제출 요청 처리
  const [isFetching, startTransition] = useTransition();

  const handleInputChange = (key: string, value: string) => {
    if (!key) return;

    setProduct({
      ...product,
      [key]: value, // 각 필드를 업데이트
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 체크
    if (!validateForm(e.target as HTMLFormElement)) return;

    const productJSON = JSON.stringify(product);
    const formData: FormData = new FormData();
    formData.append("product", productJSON);

    startTransition(async () => {
      const res = await CreateProductAction(formData);
      showToast({ message: res.message });
      await router.replace("/products"); // 상품 목록 페이지로 이동
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold">상품 등록하기</h1>

      <div className="flex flex-row space-x-4">
        <div className="flex w-[50%] flex-col bg-pink-200 p-2"></div>
        <div className="flex w-[50%] flex-col bg-yellow-200 p-2">
          <h2 className="text-xl">정보</h2>
          <form onSubmit={handleSubmit} noValidate>
            <InputObject
              labelText="상품명"
              keyName="name"
              inputValue={product.name || ""}
              inputType="text"
              setObject={handleInputChange}
              required={{
                isRequired: true,
                invalidMessage: "상품명을 입력해주세요",
              }}
              pattern={{
                regExp: NOT_EMPTY_RULE,
                invalidMessage: "상품명이 입력되지 않았습니다",
              }}
            />

            <InputObject
              labelText="모델명"
              keyName="modelName"
              inputValue={product.modelName || ""}
              inputType="text"
              setObject={handleInputChange}
              required={{
                isRequired: false,
                invalidMessage: "모델명을 입력해주세요",
              }}
            />

            <InputObject
              labelText="대표 이미지 URL"
              keyName="mainImageUrl"
              inputValue={product.mainImageUrl || ""}
              inputType="text"
              setObject={handleInputChange}
              required={{
                isRequired: false,
                invalidMessage: "대표사진 URL을 입력해주세요",
              }}
            />

            <InputObject
              labelText="가격"
              keyName="price"
              inputValue={product.price || ""}
              inputType="number"
              setObject={handleInputChange}
              required={{
                isRequired: true,
                invalidMessage: "가격을 입력해주세요",
              }}
              valueRange={[0, null]}
              showNumberInText={true}
              numberTextUnit="원"
            />

            <Button
              type="submit"
              isFetching={isFetching}
              additionalClass="w-full"
            >
              저장하기
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
