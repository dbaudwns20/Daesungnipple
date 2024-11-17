"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { PageGrid, type GridOptions, type GridType } from "@/components/grid";

import ModalNewItem from "./components/ModalNewItem";

import { showToast } from "@/utils/message";

export default function ItemsPage() {
  const router = useRouter();

  // refs
  const gridRef = useRef<GridType>(null);

  // values
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const goNew = () => {
    setIsShowModal(true);
  };

  // 함수 호출 후 처리
  const completeFunction = (callbacks: Function) => {
    // 콜백함수 호출
    callbacks();
  };

  const gridOptions = useMemo<GridOptions>(() => {
    return {
      scrollX: false,
      rowHeaders: ["rowNum", "checkbox"],
      columns: [
        {
          header: "이미지",
          name: "image",
        },
        {
          header: "이름",
          name: "name",
        },
        {
          header: "수량",
          name: "stockCount",
        },
        {
          header: "설명",
          name: "description",
        },
      ],
      contextMenu: null,
      fetchingUrl: "/api/item",
    };
  }, []);

  return (
    <>
      <header className="mb-1.5 flex h-8 items-center justify-between">
        <div className="flex gap-1">
          <Button
            type="button"
            color="blue"
            size="xs"
            onClick={() => {
              goNew();
            }}
          >
            신규
          </Button>
        </div>
      </header>
      <PageGrid ref={gridRef} gridOptions={gridOptions} />
      {isShowModal && (
        <ModalNewItem
          setIsModalOpen={setIsShowModal}
          completeFunction={completeFunction}
        />
      )}
    </>
  );
}
