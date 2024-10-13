"use client";

import { useEffect, useRef, useCallback } from "react";

import Grid from "@/components/grid";
import { type GridOptions, type GridType } from "@/components/grid/type";
import Button, { type ButtonType } from "@/components/button";

import { showToast } from "@/utils/message";
import { DeleteCategory } from "@/actions/product.category.actions";

export default function CategoriesPage() {
  const gridRef = useRef<GridType>();
  const buttonRef = useRef<ButtonType>(null);

  const gridOptions: GridOptions = {
    scrollX: false,
    rowHeaders: ["checkbox"],
    draggable: true,
    treeColumnOptions: {
      name: "name",
      useCascadingCheckbox: true,
    },
    columns: [
      { header: "ID", name: "id" },
      {
        header: "이름",
        name: "name",
      },
      {
        header: "사용여부",
        name: "isActive",
        width: 200,
      },
    ],
    contextMenu: null,
  };

  const handleButtonClick = (p: "umount" | "expandAll" | "collapseAll") => {
    switch (p) {
      case "umount":
        deleteCategory(2);
        // gridRef.current?.unmount();
        break;
      case "expandAll":
        gridRef.current?.expandAll();
        break;
      case "collapseAll":
        gridRef.current?.collapseAll();
        break;
    }
  };

  const getCategoryList = useCallback(async () => {
    const res: Response = await fetch("/api/products/categories");
    const data = await res.json();
    if (!res.ok) showToast({ message: data.message });
    else gridRef.current!.setGridData(data.list);
  }, []);

  const deleteCategory = useCallback(async (categoryId: number) => {
    DeleteCategory(categoryId).then((res) => {
      showToast({ message: res.message });
      if (res.ok) getCategoryList();
    });
  }, []);

  useEffect(() => {
    getCategoryList();
  }, [getCategoryList]);

  return (
    <>
      <header className="mb-1.5 flex items-center justify-between">
        <h1 className="font-bold text-gray-600">카테고리 관리</h1>
        <div className="flex gap-1">
          <Button
            ref={buttonRef}
            type="button"
            color="blue"
            size="xs"
            onClick={() => handleButtonClick("umount")}
          >
            그리드 제거
          </Button>
          <Button
            ref={buttonRef}
            type="button"
            color="blue"
            size="xs"
            onClick={() => handleButtonClick("expandAll")}
          >
            모든 행 열기
          </Button>
          <Button
            ref={buttonRef}
            type="button"
            color="blue"
            size="xs"
            onClick={() => handleButtonClick("collapseAll")}
          >
            모든 행 닫기
          </Button>
        </div>
      </header>

      <Grid ref={gridRef} gridOptions={gridOptions} />
    </>
  );
}
