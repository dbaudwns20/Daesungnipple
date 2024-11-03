import ToastUiGrid from "tui-grid";
import { type OptGrid } from "tui-grid/types/options";

export type GridOptions = {
  el?: HTMLElement; // el 은 컴포넌트 내에서 선언되기 때문에 Option 으로 변경
} & Omit<OptGrid, "el">;

export type GridProps = {
  gridOptions: GridOptions;
};

export type GridType = {
  self: ToastUiGrid | null;
};
