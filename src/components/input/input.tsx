import {
  useId,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  ChangeEvent,
  KeyboardEvent,
  InvalidEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";

import { InputVariants, LabelVariants } from "./variants";
import { cn } from "@/utils/cn";

export type InputType = {
  setFocus: () => void;
};

type Required = {
  isRequired: boolean;
  invalidMessage: string;
};

type Pattern = {
  regExp: RegExp;
  invalidMessage: string;
};

type NumberTypeProps = {
  inputType: "number";
  inputValue: number;
  step?: number;
  onChange: Dispatch<SetStateAction<number>>;
};

type CommonTypeProps = {
  inputType: "text" | "password" | "email";
  inputValue: string;
  pattern?: Pattern | null;
  onChange: Dispatch<SetStateAction<string>>;
};

type InputProps = {
  labelText: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  required?: Required;
  valueRange?: [number, number] | null;
  additionalClass?: string;
} & (CommonTypeProps | NumberTypeProps);

const Input = forwardRef((props: InputProps, ref) => {
  const {
    inputType,
    inputValue,
    labelText,
    isDisabled = false,
    isReadOnly = false,
    required = {
      isRequired: false,
      invalidMessage: "",
    },
    valueRange = null,
    additionalClass = "",
    onChange,
  } = props;

  const pattern: Pattern | null =
    inputType !== "number" ? (props.pattern ?? null) : null;
  const step: number | null = inputType === "number" ? (props.step ?? 1) : null;

  // 부모 컴포넌트에서 사용할 수 있는 함수 선언
  useImperativeHandle(ref, () => ({ setFocus }));

  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  // values
  const inputId: string = useId();
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [invalidMessage, setInvalidMessage] = useState<string | null>(null);

  // focus
  const setFocus = useCallback(() => {
    inputRef.current!.focus();
    inputRef.current!.select();
  }, []);

  // 커스텀규칙 정의
  const setCustomValidity = useCallback(
    (errorMessage: string, invalidText: string = "") => {
      inputRef.current?.setCustomValidity(errorMessage);
      if (invalidText.length > 0) {
        setIsInvalid(true);
        setInvalidMessage(invalidText);
      } else {
        setIsInvalid(false);
        setInvalidMessage(null);
      }
    },
    [],
  );

  const validateValueRange = useCallback(
    (value: string | number): [string, string] => {
      let errorMessage = "";
      let invalidText = "";
      if (valueRange) {
        const [min, max] = valueRange;
        if (inputType !== "number") {
          const strValue = value as string;
          if (strValue.length < min) {
            errorMessage = "Value's length is invalid.";
            invalidText = `최소 ${min}자 이상 입력해야합니다`;
          } else if (strValue.length > max) {
            errorMessage = "Value's length is invalid.";
            invalidText = `최대 ${max}자 까지만 입력가능합니다`;
          }
        } else {
          const numValue = Number(value);
          if (numValue < min) {
            errorMessage = "Value's range is invalid.";
            invalidText = `${min} 이상 입력해야합니다`;
          } else if (numValue > max) {
            errorMessage = "Value's range is invalid.";
            invalidText = `${max} 이하만 입력가능합니다`;
          }
        }
      }
      return [errorMessage, invalidText];
    },
    [inputType, valueRange],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // email 인 경우 스페이스 키 입력이 onChange 로 헨들링 되지 않는다
    if (inputType === "email" && event.key === " ") {
      event.preventDefault(); // 스페이스 입력을 막음
    }
  };

  // change 이벤트 헨들링
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      let value: any = event.target.value;

      // inputType 이 number 가 아닌 경우에만 trim 적용
      if (inputType !== "number") {
        value = value.trim();
      }

      if (!value) {
        setCustomValidity("");
        onChange(value);
        return;
      }

      let [errorMessage, invalidText] = validateValueRange(value);

      if (inputType !== "number" && pattern && !pattern.regExp.test(value)) {
        errorMessage = "Value's format is invalid.";
        invalidText = pattern.invalidMessage;
      }

      setCustomValidity(errorMessage, invalidText);
      onChange(value);
    },
    [inputType, pattern, setCustomValidity, onChange, validateValueRange],
  );

  const handleInvalid = useCallback(
    (event: InvalidEvent<HTMLInputElement>) => {
      const value: any = event.target.value;
      if (required.isRequired && !value) {
        setCustomValidity("Value is missing.", required.invalidMessage);
      }
    },
    [required, setCustomValidity],
  );

  useEffect(() => {
    if (step) inputRef.current?.setAttribute("step", step.toString());
  }, [step]);

  return (
    <div className={`block ${!isInvalid ? "mb-3" : "mb-1.5"}`}>
      <div className="relative h-12 w-full">
        <input
          id={`input_${inputId}`}
          className={cn(InputVariants({ invalid: isInvalid }), additionalClass)}
          placeholder=" "
          ref={inputRef}
          type={inputType}
          value={inputValue}
          readOnly={isReadOnly}
          disabled={isDisabled}
          onInvalid={handleInvalid}
          required={required.isRequired}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <label
          id={`input_${inputId}`}
          ref={labelRef}
          className={cn(LabelVariants({ invalid: isInvalid }))}
        >
          {labelText}
          {required.isRequired ? (
            <span className="ml-1 text-orange-400">*</span>
          ) : (
            <></>
          )}
        </label>
      </div>
      <p
        className={`ml-1.5 mt-1 flex items-center text-xs text-red-500 duration-200 ${isInvalid ? "opacity-100" : "opacity-0"}`}
      >
        {invalidMessage}
      </p>
    </div>
  );
});

Input.displayName = "Input";
export default Input;
