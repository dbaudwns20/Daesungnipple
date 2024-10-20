import React from "react";
import { createRoot } from "react-dom/client";

import Button from "@/components/button";

export default class EditingCell {
  el: HTMLElement;

  constructor(props: any) {
    const el: HTMLElement = document.createElement("div");
    const { grid, rowKey, columnInfo } = props;

    el.classList.add("flex", "items-center", "justify-center", "gap-1");

    createRoot(el).render(
      <>
        <Button
          type="button"
          color="green"
          size="xs"
          onClick={() => grid.startEditing(rowKey)}
        >
          편집
        </Button>
        <Button
          type="button"
          color="red"
          size="xs"
          onClick={() => grid.removeRow(rowKey)}
        >
          삭제
        </Button>
      </>,
    );

    this.el = el;
  }

  getElement() {
    return this.el;
  }
}
