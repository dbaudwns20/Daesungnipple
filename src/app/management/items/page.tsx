"use client";

import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button, type ButtonProps, type ButtonType } from "@/components/button";
import { Grid, type GridOptions, type GridType } from "@/components/grid";

export default function ItemsPage() {
  const router = useRouter();

  // refs
  const gridRef = useRef<GridType>(null);

  const goNew = () => {
    router.push("/management/items/new");
  };

  const gridOptions = useMemo<GridOptions>(() => {
    return {
      scrollX: false,
      rowHeaders: ["checkbox"],
      // bodyHeight: "fitToParent",
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
    </>
  );
}
