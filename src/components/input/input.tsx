import "./style.css";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
  ChangeEvent,
  InvalidEvent,
  Dispatch,
  SetStateAction,
} from "react";

import { generateRandomText } from "@/utils/common";

export type InputType = {
  setFocus: () => void;
};

type Required = {
  isRequired: boolean;
  invalidMessage: string;
};

type Pattern = {
  regExp: RegExp | null;
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

  const inputId: string = useMemo(() => `input_${generateRandomText()}`, []);
  const [invalidMessage, setInvalidMessage] = useState<string | null>(null);

  const setFocus = () => {
    inputRef.current!.focus();
    inputRef.current!.select();
    inputRef.current!.setSelectionRange(0, 999); // For mobile devices.
  };

  // 커스텀규칙 정의
  const setCustomValidity = (
    errorMessage: string,
    invalidText: string = ""
  ) => {
    inputRef.current?.setCustomValidity(errorMessage);
    const isInvalid: boolean = invalidText.length > 0;
    setInvalidMessage(isInvalid ? invalidText : null);
    if (isInvalid) {
      inputRef.current!.classList.add("is-invalid");
      labelRef.current!.classList.add("is-invalid");
    } else {
      inputRef.current!.classList.remove("is-invalid");
      labelRef.current!.classList.remove("is-invalid");
    }
  };

  // change 이벤트 헨들링
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: any = event.target.value;

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

    // 길이 체크
    if (valueRange && inputType != "number") {
      const [min, max]: [number, number] = valueRange;
      if (value.length < min) {
        errorMessage = "Value's length is invalid.";
        invalidText = `최소 ${min}자 이상 입력해야합니다`;
      }
      if (value.length > max) {
        errorMessage = "Value's length is invalid.";
        invalidText = `최대 ${max}자 까지만 입력가능합니다`;
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

  useEffect(() => {
    // set element id
    inputRef.current!.setAttribute("id", inputId);
  }, [inputId]);

  return (
    <div className="input-wrapper">
      <input
        className="input"
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
      <label className="label" ref={labelRef}>
        {labelText}
      </label>
      <p className="invalid-message">{invalidMessage}</p>
    </div>
  );
});

Input.displayName = "Input";
export default Input;
