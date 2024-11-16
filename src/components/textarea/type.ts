import { ChangeEvent } from "react";

export type Required = {
  isRequired: boolean;
  invalidMessage: string;
};

export type Pattern = {
  regExp: RegExp;
  invalidMessage: string;
};

export type TextareaProps = {
  name: string;
  value: string;
  label: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  required?: Required;
  pattern?: Pattern | null;
  valueRange?: [number, number] | null;
  additionalClass?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void | Promise<void>;
};

export type TextareaType = {
  setFocus: () => void;
  setCustomValidity: (errorMessage: string, invalidText: string) => void;
  element: HTMLDivElement | null;
};
