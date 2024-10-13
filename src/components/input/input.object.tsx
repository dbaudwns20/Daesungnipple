import {
  useId,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  ChangeEvent,
  InvalidEvent
} from "react";

import { InputVariants, LabelVariants } from "./variants";
import { cn } from "@/utils/cn";
import { addComma, numberToKorean } from "@/utils/common";

export type InputObjectType = {
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
  inputType: "text" | "password" | "number" | "email";
  inputValue: any;
  labelText: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  required?: Required;
  pattern?: Pattern;
  additionalClass?: string;
  valueRange?: [ number | null, number | null ]; // null 이면 범위 체크 안함
  showNumberInText?: boolean;
  numberTextUnit?: "원" | "개" | "건";
  keyName: string;
  setObject: (keyName: string, value: string) => void;
};

const InputObject = forwardRef((props: InputProps, ref) => {
  const {
    inputType,
    inputValue,
    labelText,
    isDisabled = false,
    isReadOnly = false,
    required = {
      isRequired: false,
      invalidMessage: ""
    },
    pattern = {
      regExp: null,
      invalidMessage: ""
    },
    valueRange,
    showNumberInText = false,
    numberTextUnit,
    additionalClass = "",
    keyName = "",
    setObject
  } = props;

  // 부모 컴포넌트에서 사용할 수 있는 함수 선언
  useImperativeHandle(ref, () => ({ setFocus }));

  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  // values
  const inputId: string = useId();
  const [ isInvalid, setIsInvalid ] = useState<boolean>(false);
  const [ invalidMessage, setInvalidMessage ] = useState<string | null>(null);

  // number 타입일 경우, 텍스트로 표시
  const [ numberTextValue, setNumberTextValue ] = useState<string>("");

  // focus
  const setFocus = () => {
    inputRef.current!.focus();
    inputRef.current!.select();
  };

  // 커스텀규칙 정의
  const setCustomValidity = (
    errorMessage: string,
    invalidText: string = ""
  ) => {
    inputRef.current?.setCustomValidity(errorMessage);
    setIsInvalid(invalidText.length > 0);
    setInvalidMessage(invalidText.length > 0 ? invalidText : null);
  };

  // 유효성 체크
  const validate = (value: string): any => {
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
      const [ min, max ]: [ number | null, number | null ] = valueRange;
      if (inputType != "number") {
        // 길이 체크
        const lengthValue: number = value ? value.length : 0;
        if (min !== null && lengthValue < min) {
          errorMessage = "Value's length is invalid.";
          invalidText = `최소 ${ addComma(min) }자 이상 입력해야합니다`;
        } else if (max !== null && lengthValue > max) {
          errorMessage = "Value's length is invalid.";
          invalidText = `최대 ${ addComma(max) }자 까지만 입력가능합니다`;
        }
      } else {
        // 범위 체크
        const numberValue: number = Number(value || 0);
        if (min !== null && numberValue < min) {
          errorMessage = "Value's range is invalid.";
          invalidText = `${ addNumberTextUnit(addComma(min)) } 이상 입력해야합니다`;
        } else if (max !== null && numberValue > max) {
          errorMessage = "Value's range is invalid.";
          invalidText = `${ addNumberTextUnit(addComma(max)) } 이하만 입력가능합니다`;
        }
      }
    }
    return { errorMessage, invalidText };
  };

  // 숫자로 보길 원하는지 텍스트로 보길 원하는지
  const switchShowNumberText = (value: number): string => {
    let result: string = "";
    if (value === 0) return "";
    if (showNumberInText) {
      result = `${ numberToKorean(value) }`;
    } else {
      result = `${ addComma(value) }`;
    }
    return addNumberTextUnit(result);
  };

  // 단위 추가
  const addNumberTextUnit = (value: string): string => {
    let result: string = value;
    if (result.length > 0 && numberTextUnit) {
      result += ` ${ numberTextUnit }`;
    }
    return result;
  };

  // change 이벤트 헨들링
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (inputType === "number") {
      setNumberTextValue(switchShowNumberText(Number(value)));
    }

    if (!value) {
      setCustomValidity("");
      setObject(keyName, value);
      return;
    }

    const { errorMessage, invalidText } = validate(value);

    setCustomValidity(errorMessage, invalidText);
    setObject(keyName, value);
  };

  // invalid 이벤트 헨들링 => Submit 이벤트 후 처리
  const handleInvalid = (event: InvalidEvent<HTMLInputElement>) => {
    const value: any = event.target.value;

    if (required.isRequired && !value) {
      setCustomValidity("Value is missing.", required.invalidMessage);
    }
  };

  return (
    <div className={ `block ${ !isInvalid ? "mb-3" : "mb-1.5" }` }>
      <div className="relative h-12 w-full">
        <input
          id={ `input_${ inputId }` }
          className={ cn(InputVariants({ invalid: isInvalid }), additionalClass) }
          placeholder=" "
          ref={ inputRef }
          type={ inputType }
          value={ inputValue }
          readOnly={ isReadOnly }
          disabled={ isDisabled }
          onInvalid={ handleInvalid }
          required={ required.isRequired }
          onChange={ (e) => handleChange(e) }
        />
        <label
          id={ `input_${ inputId }` }
          ref={ labelRef }
          className={ cn(LabelVariants({ invalid: isInvalid })) }
        >
          { labelText }
          { required.isRequired ? (
            <span className="ml-1 text-orange-400">*</span>
          ) : (
            <></>
          ) }
        </label>
      </div>
      <p
        className={ `ml-1.5 mt-1 flex items-center text-xs duration-200 
        ${ isInvalid ? "text-red-500 opacity-100" : showNumberInText ? "text-gray-500 opacity-100" : "opacity-0" }` }
      >
        { isInvalid ? invalidMessage : showNumberInText ? numberTextValue : ""}
      </p>
    </div>
  );
});

InputObject.displayName = "InputObject";
export default InputObject;
