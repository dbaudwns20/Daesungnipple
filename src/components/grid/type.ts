import { type OptGrid } from "tui-grid/types/options";

export interface GridOptions extends Partial<OptGrid> {
  el?: HTMLElement; // el 은 컴포넌트 내에서 선언되기 때문에 Option 으로 변경
}

export interface GridProps {
  gridOptions: any;
}

export interface GridType {
  read: () => Promise<void>;
  reload: () => Promise<void>;
  unmount: () => void;
  expandAll: () => void;
  collapseAll: () => void;
  element: HTMLDivElement | null;
}
