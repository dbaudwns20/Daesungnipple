"use client";

import {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { GridProps } from "./type";

import ToastUiGrid from "tui-grid";
import { TuiGridEvent } from "tui-grid/types/event";
import "tui-grid/dist/tui-grid.css";

export const Grid = forwardRef((props: GridProps, ref) => {
  const { gridOptions } = props;

  // refs
  const componentRef = useRef<HTMLDivElement>(null);

  // values
  const [self, setSelf] = useState<ToastUiGrid>();

  // 부모 컴포넌트에서 사용할 수 있는 함수 선언
  useImperativeHandle(ref, () => ({
    self,
  }));

  // init grid
  const initGrid = useCallback(() => {
    ToastUiGrid.setLanguage("ko");
    ToastUiGrid.applyTheme("clean");
    setSelf(
      new ToastUiGrid({
        el: componentRef.current as HTMLElement,
        ...gridOptions,
      }),
    );
  }, [gridOptions]);

  // EventBus Handling
  useEffect(() => {
    if (!self) return;

    const handleExpand = (ev: TuiGridEvent) => {
      console.log("Expand event detected");
    };

    const handleCollapse = (ev: TuiGridEvent) => {
      console.log("Collapse event detected");
    };

    const handleEditingStart = (ev: TuiGridEvent) => {
      console.log("Editing start event detected");
    };

    const handleEditingFinish = (ev: TuiGridEvent) => {
      console.log("Editing finish event detected");
    };

    // 이벤트 리스너 등록
    self.on("expand", handleExpand);
    self.on("collapse", handleCollapse);
    self.on("editingStart", handleEditingStart);
    self.on("editingFinish", handleEditingFinish);

    // 언마운트 시 이벤트 리스너 제거
    return () => {
      if (self) {
        self.off("expand", handleExpand);
        self.off("collapse", handleCollapse);
        self.off("editingStart", handleEditingStart);
        self.off("editingFinish", handleEditingFinish);
      }
    };
  }, [self]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  return <div ref={componentRef}></div>;
});

Grid.displayName = "Grid";
