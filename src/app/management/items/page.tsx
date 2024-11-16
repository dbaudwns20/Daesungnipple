"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button, type ButtonProps, type ButtonType } from "@/components/button";
import { Grid, type GridOptions, type GridType } from "@/components/grid";
import ModalNewItem from "./components/ModalNewItem";
import { showToast } from "@/utils/message";

type QueryOption = {
  page: number;
  unit: number;
};

export default function ItemsPage() {
  const router = useRouter();

  // refs
  const gridRef = useRef<GridType>(null);

  // values
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [queryOption, setQueryOption] = useState<QueryOption>({
    page: 1,
    unit: 10,
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const goNew = () => {
    setIsShowModal(true);
  };

  // 함수 호출 후 처리
  const completeFunction = (callbacks: Function) => {
    // 콜백함수 호출
    callbacks();
    // 조회정보 초기화
    reset();
  };

  const gridOptions = useMemo<GridOptions>(() => {
    return {
      scrollX: false,
      rowHeaders: ["checkbox"],
      bodyHeight: "fitToParent",
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
    };
  }, []);

  const getItemList = useCallback(async (queryOption: QueryOption) => {
    setIsFetching(true);

    const res = await fetch(
      `/api/item?page=${queryOption.page}&unit=${queryOption.unit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const result = await res.json();
    if (res.ok) {
      gridRef.current!.self!.resetData(result.data.list);
    } else {
      showToast({ message: result.message });
    }

    setIsFetching(false);
  }, []);

  // 현재 페이지 갱신
  const reload = async () => {
    getItemList(queryOption);
  };

  // 첫번째 페이지로 이동
  const reset = useCallback(async () => {
    setQueryOption({
      page: 1,
      unit: 10,
    });
  }, []);

  useEffect(() => {
    getItemList(queryOption);
  }, [getItemList, queryOption]);

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
      <Grid ref={gridRef} gridOptions={gridOptions} />
      {isShowModal && (
        <ModalNewItem
          setIsModalOpen={setIsShowModal}
          completeFunction={completeFunction}
        />
      )}
    </>
  );
}
