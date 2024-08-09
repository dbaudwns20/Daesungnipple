import "./style.css";

import {
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";

import { generateRandomText } from "@/utils/common";

type InputProps = {
  inputType: "text" | "number" | "password";
  inputValue: any;
  labelText: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onChange: Dispatch<SetStateAction<any>>;
};

export type InputType = {};

const Input = forwardRef((props: InputProps, ref) => {
  const {
    inputType,
    inputValue,
    labelText,
    isDisabled = false,
    isReadOnly = false,
    onChange,
  } = props;

  // 부모 컴포넌트에서 사용할 수 있는 함수 선언
  useImperativeHandle(ref, () => ({}));

  const inputRef = useRef<HTMLInputElement>(null);

  const inputId: string = useMemo(() => `input_${generateRandomText()}`, []);

  // set element id
  useEffect(() => {
    inputRef.current!.setAttribute("id", inputId);
  }, [inputId]);

  return (
    <div className="relative w-full min-w-[200px] h-10">
      <input
        className="peer w-full h-full bg-transparent text-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-gray-200 focus:border-blue-500"
        placeholder=" "
        ref={inputRef}
        type={inputType}
        value={inputValue}
        readOnly={isReadOnly}
        disabled={isDisabled}
        onChange={(e) => onChange(e.target.value)}
      />
      <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:!border-blue-500 after:border-blue-gray-200 peer-focus:after:!border-blue-500">
        {labelText}
      </label>
      <p className="ml-1 mt-0.5 invisible peer-invalid:visible text-pink-600 text-sm">
        Please provide a valid email address.
      </p>
    </div>
  );
});

Input.displayName = "Input";
export default Input;
