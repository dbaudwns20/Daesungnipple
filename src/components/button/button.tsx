import {
  useId,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  ReactNode,
} from "react";

import {
  ButtonVariants,
  type ButtonColorType,
  type ButtonSizeType,
} from "./variants";
import { cn } from "@/utils/cn";

export type ButtonType = {
  setFocus: () => void;
  element: HTMLButtonElement | null;
};

type ButtonProps = {
  children: ReactNode | ReactNode[] | string;
  type: "button" | "submit" | "reset";
  isDisabled?: boolean;
  isFetching?: boolean;
  color?: ButtonColorType;
  size?: ButtonSizeType;
  additionalClass?: string;
  onClick?: (...arg: any) => void | Promise<void>;
};

const Button = forwardRef((props: ButtonProps, ref) => {
  const {
    children,
    type,
    isDisabled = false,
    isFetching = false,
    color = "black",
    size = "md",
    additionalClass = "",
    onClick,
  } = props;

  // 부모 컴포넌트에서 사용할 수 있는 함수 선언
  useImperativeHandle(ref, () => ({ setFocus, element: componentRef.current }));

  // refs
  const componentRef = useRef<HTMLButtonElement>(null);

  // values
  const buttonId: string = useId();

  const setFocus = () => {
    componentRef.current!.focus();
  };

  useEffect(() => {
    if (isDisabled) return;
    if (isFetching) {
      componentRef.current!.setAttribute("disabled", "disabled");
    } else {
      componentRef.current!.removeAttribute("disabled");
    }
  }, [isDisabled, isFetching]);

  return (
    <button
      ref={componentRef}
      id={`${type}_${buttonId}`}
      aria-describedby={`${type}_${buttonId}`}
      className={cn(
        ButtonVariants({ color: color, size: size }),
        additionalClass,
      )}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
    >
      {isFetching ? (
        <>
          <svg
            className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
        children
      )}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
