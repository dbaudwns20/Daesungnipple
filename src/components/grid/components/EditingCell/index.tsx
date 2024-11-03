import { createRoot } from "react-dom/client";

import { type CellRendererProps } from "tui-grid/types/renderer";

export class CustomCell {
  el: HTMLElement;

  constructor(props: CellRendererProps) {
    const { grid, rowKey, columnInfo } = props;
    const { tag, className, content } = columnInfo.renderer.options!;
    // 해당 태그로 생성
    const el: HTMLElement = document.createElement(tag);
    // 스타일 적용
    className?.forEach((cls: string) => el.classList.add(cls));
    // 렌더링
    createRoot(el).render(content);

    this.el = el;
  }

  getElement() {
    return this.el;
  }
}
