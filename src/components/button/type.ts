import { ReactNode } from "react";

export type ButtonColorType =
  | "black"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "white";

export type ButtonSizeType = "xs" | "sm" | "md" | "lg" | "xl";

export type ButtonType = {
  setFocus: () => void;
  element: HTMLButtonElement | null;
};

export type ButtonProps = {
  children: ReactNode | ReactNode[] | string;
  type: "button" | "submit" | "reset";
  isDisabled?: boolean;
  isFetching?: boolean;
  color?: ButtonColorType;
  size?: ButtonSizeType;
  additionalClass?: string;
  onClick?: (...arg: any) => void | Promise<void>;
};
