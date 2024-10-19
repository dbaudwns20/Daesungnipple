"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { GridProps, GridOptions, GridType } from "./type";

import ToastUiGrid from "tui-grid";
import { TuiGridEvent } from "tui-grid/types/event";
import "tui-grid/dist/tui-grid.css";

const Grid = forwardRef((props: GridProps, ref) => {
  const { gridOptions } = props;

  // refs
  const gridRef = useRef<ToastUiGrid>();
  const componentRef = useRef<HTMLDivElement>(null);

  // 부모 컴포넌트에서 사용할 수 있는 함수 선언
  useImperativeHandle(ref, () => ({
    setGridData,
    unmount,
    expandAll,
    collapseAll,
    element: componentRef.current,
  }));

  // init grid
  const initGrid = useCallback(() => {
    gridRef.current = new ToastUiGrid({
      el: componentRef.current as HTMLElement,
      ...gridOptions,
    });
  }, [gridOptions]);

  // grid Apis
  const setGridData = (newData: any) => gridRef.current!.resetData(newData);
  const expandAll = () => gridRef.current!.expandAll();
  const collapseAll = () => gridRef.current!.collapseAll();
  const unmount = () => gridRef.current!.destroy();

  // EventBus Handling
  useEffect(() => {
    if (!gridRef.current) return;

    const handleExpand = (ev: TuiGridEvent) => {
      console.log("Expand event detected");
    };

    const handleCollapse = (ev: TuiGridEvent) => {
      console.log("Collapse event detected");
    };

    // 이벤트 리스너 등록
    gridRef.current.on("expand", handleExpand);
    gridRef.current.on("collapse", handleCollapse);

    // 언마운트 시 이벤트 리스너 제거
    return () => {
      if (gridRef.current) {
        gridRef.current.off("expand", handleExpand);
        gridRef.current.off("collapse", handleCollapse);
      }
    };
  }, []);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  return <div ref={componentRef}></div>;
});

Grid.displayName = "grid";
export default Grid;
export type { GridProps, GridOptions, GridType };
