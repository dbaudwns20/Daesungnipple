import { type OptGrid } from "tui-grid/types/options";

export interface GridOptions extends Omit<OptGrid, "el"> {
  el?: HTMLElement; // el 은 컴포넌트 내에서 선언되기 때문에 Option 으로 변경
}

export interface GridProps {
  gridOptions: GridOptions;
}

export interface GridType {
  setGridData: (newData: any) => void;
  unmount: () => void;
  expandAll: () => void;
  collapseAll: () => void;
  element: HTMLDivElement | null;
}
