"use client";

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useFormData } from "@/hooks";

import Input, { type InputType } from "@/components/input";
import {
  Grid,
  CustomCell,
  type GridOptions,
  type GridType,
} from "@/components/grid";
import Button from "@/components/button";

type NewProduct = {
  name: string;
  modelName: string;
  price: number;
};

export default function ProductNew() {
  // refs
  const nameRef = useRef<InputType>(null);
  const gridRef = useRef<GridType>();

  // grid func & values
  const addOption = () => {
    gridRef.current!.self!.appendRow({
      name: "",
      price: 0,
    });
    gridRef.current!.self!.startEditing(
      gridRef.current!.self!.getRowCount() - 1,
      "name",
      true,
    );
  };

  const removeOption = () => {
    const rowKey: string | number | null =
      gridRef.current!.self!.getFocusedCell().rowKey;
    if (rowKey !== null) gridRef.current!.self!.removeRow(rowKey);
  };

  const gridOptions = useMemo<GridOptions>(() => {
    return {
      scrollX: false,
      draggable: true,
      columns: [
        {
          header: "옵션명",
          name: "name",
          editor: "text",
        },
        {
          header: "가격",
          name: "price",
          editor: "text",
        },
        {
          header: "",
          name: "",
          width: 100,
          renderer: {
            type: CustomCell,
            options: {
              tag: "div",
              className: ["flex", "items-center", "justify-center", "gap-1"],
              content: (
                <Button
                  type="button"
                  color="red"
                  size="xs"
                  onClick={removeOption}
                >
                  삭제
                </Button>
              ),
            },
          },
        },
      ],
      contextMenu: null,
    };
  }, []);

  const [formData, bindFormData] = useFormData<NewProduct>({
    name: "",
    modelName: "",
    price: 0,
  });

  useEffect(() => {
    nameRef.current?.setFocus();
  }, []);

  return (
    <>
      <header className="mb-1.5 flex h-8 items-center justify-between">
        <h1 className="font-bold text-gray-600">상품 추가</h1>
      </header>
      <form className="w-full p-5">
        <p className="mb-2.5 text-sm font-semibold text-gray-400">상품 정보</p>
        <Input
          ref={nameRef}
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
          label="카테고리"
          value={formData.modelName}
          required={{
            isRequired: true,
            invalidMessage: "카테고리를 선택해주세요.",
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            bindFormData("modelName", e.target.value);
          }}
          valueRange={[2, 999]}
        />
        <Input
          type="text"
          name="modelName"
          label="모델"
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
        <p className="mb-2.5 text-sm font-semibold text-gray-400">배송 정보</p>
        <div className="mb-3 block">
          <div className="flex items-center justify-between">
            <p className="mb-2.5 text-sm font-semibold text-gray-400">
              상품 옵션
            </p>
            <div className="flex gap-1">
              <a
                className="text-xs font-semibold text-blue-500 hover:cursor-pointer hover:text-blue-600"
                onClick={addOption}
              >
                + 옵션 추가
              </a>
            </div>
          </div>
          <Grid ref={gridRef} gridOptions={gridOptions} />
        </div>
        <p className="mb-2.5 text-sm font-semibold text-gray-400">
          상품 이미지
        </p>
        <p className="mb-2.5 text-sm font-semibold text-gray-400">
          상품 상세 이미지
        </p>
      </form>
    </>
  );
}
