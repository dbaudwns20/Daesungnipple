import { ChangeEvent } from "react";

export type Required = {
  isRequired: boolean;
  invalidMessage: string;
};

export type Pattern = {
  regExp: RegExp;
  invalidMessage: string;
};

type NumberTypeProps = {
  type: "number";
  value: number;
  step?: number;
};

type CommonTypeProps = {
  type: "text" | "password" | "email" | "tel";
  value: string;
  pattern?: Pattern | null;
};

export type InputProps = {
  labelText: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  required?: Required;
  valueRange?: [number, number] | null;
  additionalClass?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
} & (CommonTypeProps | NumberTypeProps);

export type InputType = {
  setFocus: () => void;
  setCustomValidity: (errorMessage: string, invalidText: string) => void;
  element: HTMLDivElement | null;
};
