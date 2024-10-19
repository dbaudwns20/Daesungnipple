"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useFormData } from "@/hooks";

import Input from "@/components/input";

type NewProduct = {
  name: string;
  modelName: string;
  price: number;
};

export default function ProductNew() {
  const [formData, bindFormData] = useFormData<NewProduct>({
    name: "",
    modelName: "",
    price: 0,
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <>
      <header className="mb-1.5 flex h-8 items-center justify-between">
        <h1 className="font-bold text-gray-600">상품 추가</h1>
      </header>
      <form className="py-3">
        <Input
          type="text"
          name="name"
          label="상품명"
          value={formData.name}
          required={{
            isRequired: true,
            invalidMessage: "상품명을 입력해주세요.",
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            bindFormData("name", e.target.value);
          }}
          valueRange={[2, 999]}
        />
        <Input
          type="text"
          name="modelName"
          label="모델명"
          value={formData.modelName}
          required={{
            isRequired: true,
            invalidMessage: "모델명을 입력해주세요.",
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            bindFormData("modelName", e.target.value);
          }}
          valueRange={[2, 999]}
        />

        <Input
          type="number"
          name="price"
          label="판매가"
          value={formData.price}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            bindFormData("price", Number(e.target.value));
          }}
          required={{
            isRequired: true,
            invalidMessage: "판매가를 입력해주세요.",
          }}
          step={1000}
          valueRange={[0, 9999999999]}
        />
      </form>
    </>
  );
}
