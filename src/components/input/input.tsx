import {
  useId,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  ChangeEvent,
  InvalidEvent,
  Dispatch,
  SetStateAction,
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

type InputProps = {
  inputType: "text" | "password" | "number";
  inputValue: any;
  labelText: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  required?: Required;
  pattern?: Pattern;
  valueRange?: [number, number];
  onChange: Dispatch<SetStateAction<any>>;
};

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
    pattern = {
      regExp: null,
      invalidMessage: "",
    },
    valueRange,
    onChange,
  } = props;

  // 부모 컴포넌트에서 사용할 수 있는 함수 선언
  useImperativeHandle(ref, () => ({ setFocus }));

  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  const inputId: string = useId();
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [invalidMessage, setInvalidMessage] = useState<string | null>(null);

  const setFocus = () => {
    inputRef.current!.focus();
    inputRef.current!.select();
    inputRef.current!.setSelectionRange(0, 999); // For mobile devices.
  };

  // 커스텀규칙 정의
  const setCustomValidity = (
    errorMessage: string,
    invalidText: string = "",
  ) => {
    inputRef.current?.setCustomValidity(errorMessage);
    setIsInvalid(invalidText.length > 0);
    setInvalidMessage(invalidText.length > 0 ? invalidText : null);
  };

  // change 이벤트 헨들링
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value: any = event.target.value;

    if (!value) {
      setCustomValidity("");
      onChange(value);
      return;
    }

    let errorMessage: string = "";
    let invalidText: string = "";

    // 정규식 체크
    if (pattern.regExp) {
      const { regExp, invalidMessage } = pattern;
      if (!regExp.test(value)) {
        errorMessage = "Value's format is invalid.";
        invalidText = invalidMessage;
      }
    }

    // 값 범위가 존재할 경우
    if (valueRange) {
      const [min, max]: [number, number] = valueRange;
      if (inputType != "number") {
        // 길이 체크
        if (value.length < min) {
          errorMessage = "Value's length is invalid.";
          invalidText = `최소 ${min}자 이상 입력해야합니다`;
        }
        if (value.length > max) {
          errorMessage = "Value's length is invalid.";
          invalidText = `최대 ${max}자 까지만 입력가능합니다`;
        }
      } else {
        // 범위 체크
        if (Number(value) < min) {
          errorMessage = "Value's range is invalid.";
          invalidText = `${min} 이상 입력해야합니다`;
        }
        if (Number(value) > max) {
          errorMessage = "Value's range is invalid.";
          invalidText = `${max} 이하만 입력가능합니다`;
        }
      }
    }

    setCustomValidity(errorMessage, invalidText);
    onChange(value);
  };

  // invalid 이벤트 헨들링 => Submit 이벤트 후 처리
  const handleInvalid = (event: InvalidEvent<HTMLInputElement>) => {
    const value: any = event.target.value;

    if (required.isRequired && !value) {
      setCustomValidity("Value is missing.", required.invalidMessage);
    }
  };

  return (
    <div className="relative h-12 w-full min-w-[350px]">
      <input
        id={`input_${inputId}`}
        className={cn(InputVariants({ invalid: isInvalid }))}
        placeholder=" "
        ref={inputRef}
        type={inputType}
        value={inputValue}
        readOnly={isReadOnly}
        disabled={isDisabled}
        onInvalid={handleInvalid}
        required={required.isRequired}
        onChange={(e) => handleChange(e)}
      />
      <label
        id={`input_${inputId}`}
        ref={labelRef}
        className={cn(LabelVariants({ invalid: isInvalid }))}
      >
        {required.isRequired ? (
          <>
            {labelText}
            <span className="ml-1 text-orange-400">*</span>
          </>
        ) : (
          labelText
        )}
      </label>
      <p className="invisible ml-1 mt-1 flex items-center gap-1 text-xs text-red-500 peer-invalid:visible">
        {invalidMessage}
      </p>
    </div>
  );
});

Input.displayName = "Input";
export default Input;
