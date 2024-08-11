import "./style.css";

import {
  useRef,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

import { generateRandomText } from "@/utils/common";

export type ButtonType = {
  setFocus: () => void;
};

type ButtonProps = {
  type: "button" | "submit" | "reset";
  buttonText: string;
  isDisabled?: boolean;
  isFetching?: boolean;
};

const Button = forwardRef((props: ButtonProps, ref) => {
  const { type, buttonText, isDisabled = false, isFetching = false } = props;

  // 부모 컴포넌트에서 사용할 수 있는 함수 선언
  useImperativeHandle(ref, () => ({ setFocus }));

  const buttonRef = useRef<HTMLButtonElement>(null);

  // values
  const buttonId = useMemo(() => `button_${generateRandomText()}`, []);

  const setFocus = () => {
    buttonRef.current!.focus();
  };

  useEffect(() => {
    // set element id
    buttonRef.current!.setAttribute("id", buttonId);
  }, [buttonId]);

  useEffect(() => {
    if (isDisabled) return;
    if (isFetching) {
      buttonRef.current!.setAttribute("disabled", "disabled");
    } else {
      buttonRef.current!.removeAttribute("disabled");
    }
  }, [isDisabled, isFetching]);

  return (
    <button
      className="button"
      ref={buttonRef}
      type={type}
      disabled={isDisabled}
    >
      {isFetching ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          처리중...
        </>
      ) : (
        buttonText
      )}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
