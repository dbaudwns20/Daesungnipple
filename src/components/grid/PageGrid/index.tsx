"use client";
import {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { type GridProps } from "../type";

import { showToast } from "@/utils/message";

import ToastUiGrid from "tui-grid";
import { TuiGridEvent } from "tui-grid/types/event";
import "tui-grid/dist/tui-grid.css";
import "tui-pagination/dist/tui-pagination.css";

export const PageGrid = forwardRef((props: GridProps, ref) => {
  const { gridOptions } = props;
  // refs
  const PageGridRef = useRef<HTMLDivElement>(null);
  const gridOptionsRef = useRef(gridOptions);
  const fetchingUrl = useRef(gridOptions.fetchingUrl);
  const gridInstanceRef = useRef<ToastUiGrid>();

  // values
  const [self, setSelf] = useState<ToastUiGrid>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // 부모 컴포넌트에서 사용할 수 있는 함수 선언
  useImperativeHandle(ref, () => ({
    self,
    read,
  }));

  const read = useCallback(async (page: number = 1, unit: number = 10) => {
    const gridInstance = gridInstanceRef.current;
    if (!gridInstance) return;

    setIsFetching(true);
    try {
      const res = await fetch(
        `${fetchingUrl.current}?page=${page}&unit=${unit}`,
      );
      const result = await res.json();
      if (res.ok) {
        const { list, totalCount } = result.data;
        gridInstance.resetData(list, {
          pageState: {
            page: page,
            perPage: unit,
            totalCount: totalCount,
          },
        });
      } else {
        showToast({ message: result.message, color: "red" });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast({
        message: "데이터 로딩 중 오류가 발생했습니다.",
        color: "red",
      });
    } finally {
      setIsFetching(false);
    }
  }, []); // 의존성 제거

  // Grid 이벤트 핸들러들
  const eventHandlers = useRef({
    handleExpand: (ev: TuiGridEvent) => {
      console.log("Expand event detected");
    },
    handleCollapse: (ev: TuiGridEvent) => {
      console.log("Collapse event detected");
    },
    handleEditingStart: (ev: TuiGridEvent) => {
      console.log("Editing start event detected");
    },
    handleEditingFinish: (ev: TuiGridEvent) => {
      console.log("Editing finish event detected");
    },
    handleBeforePageMove: (ev: any) => ev.stop(),
    handleAfterPageMove: (ev: any) => read(ev.page),
  });

  // init grid
  const initGrid = useCallback(() => {
    if (!PageGridRef.current || gridInstanceRef.current) return;

    ToastUiGrid.setLanguage("ko");
    ToastUiGrid.applyTheme("clean");

    const gridInstance = new ToastUiGrid({
      el: PageGridRef.current as HTMLElement,
      ...gridOptionsRef.current,
      pageOptions: {
        page: 1,
        perPage: 10,
        totalCount: 0,
      },
    });

    gridInstanceRef.current = gridInstance;
    setSelf(gridInstance);
  }, []);

  // Grid 초기화
  useEffect(() => {
    initGrid();
  }, [initGrid]);

  // 데이터 로드
  useEffect(() => {
    if (gridInstanceRef.current) {
      read();
    }
  }, [read]);

  // EventBus Handling
  useEffect(() => {
    const gridInstance = gridInstanceRef.current;
    if (!gridInstance) return;

    const handlers = eventHandlers.current;

    // 이벤트 리스너 등록
    gridInstance.on("expand", handlers.handleExpand);
    gridInstance.on("collapse", handlers.handleCollapse);
    gridInstance.on("editingStart", handlers.handleEditingStart);
    gridInstance.on("editingFinish", handlers.handleEditingFinish);
    gridInstance.on("beforePageMove", handlers.handleBeforePageMove);
    gridInstance.on("afterPageMove", handlers.handleAfterPageMove);

    // 언마운트 시 이벤트 리스너 제거
    return () => {
      if (gridInstance) {
        gridInstance.off("expand", handlers.handleExpand);
        gridInstance.off("collapse", handlers.handleCollapse);
        gridInstance.off("editingStart", handlers.handleEditingStart);
        gridInstance.off("editingFinish", handlers.handleEditingFinish);
        gridInstance.off("beforePageMove", handlers.handleBeforePageMove);
        gridInstance.off("afterPageMove", handlers.handleAfterPageMove);
      }
    };
  }, []);

  return <div className="h-full w-full" ref={PageGridRef}></div>;
});

PageGrid.displayName = "PageGrid";
