import {
  useRef,
  useId,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  InvalidEvent,
  ChangeEvent,
} from "react";

import { TextareaProps } from "./type";
import { TextareaVariants, LabelVariants } from "./variants";
import { cn } from "@/utils/cn";

export const Textarea = forwardRef((props: TextareaProps, ref) => {
  const {
    name,
    value,
    label,
    isDisabled = false,
    isReadOnly = false,
    required = {
      isRequired: false,
      invalidMessage: "",
    },
    valueRange = null,
    additionalClass = "",
    pattern = null,
    onChange,
  } = props;

  // 부모 컴포넌트에서 사용할 수 있는 함수 선언
  useImperativeHandle(ref, () => ({
    setFocus,
    setCustomValidity,
    element: componentRef.current,
  }));

  // refs
  const componentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  // values
  const textareaId: string = useId();
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [invalidMessage, setInvalidMessage] = useState<string | null>(null);

  // focus
  const setFocus = useCallback(() => {
    textareaRef.current!.focus();
    textareaRef.current!.select();
  }, []);

  // 커스텀규칙 정의
  const setCustomValidity = useCallback(
    (errorMessage: string, invalidText: string = "") => {
      textareaRef.current?.setCustomValidity(errorMessage);
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
        const strValue = value as string;
        if (strValue.length < min) {
          errorMessage = "Value's length is invalid.";
          invalidText = `최소 ${min}자 이상 입력해야합니다`;
        } else if (strValue.length > max) {
          errorMessage = "Value's length is invalid.";
          invalidText = `최대 ${max}자 까지만 입력가능합니다`;
        }
      }
      return [errorMessage, invalidText];
    },
    [valueRange],
  );

  // change 이벤트 헨들링
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      let value: string = event.target.value;

      if (!value) {
        setCustomValidity("");
        onChange(event);
        return;
      }

      let [errorMessage, invalidText] = validateValueRange(value);
      if (pattern && !pattern.regExp.test(value)) {
        errorMessage = "Value's format is invalid.";
        invalidText = pattern.invalidMessage;
      }

      setCustomValidity(errorMessage, invalidText);
      onChange(event);
    },
    [pattern, setCustomValidity, validateValueRange, onChange],
  );

  const handleInvalid = useCallback(
    (event: InvalidEvent<HTMLTextAreaElement>) => {
      const value: any = event.target.value;
      if (required.isRequired && !value) {
        setCustomValidity("Value is missing.", required.invalidMessage);
      }
    },
    [required, setCustomValidity],
  );

  return (
    <div ref={componentRef} className={`block ${!isInvalid ? "mb-3" : "mb-2"}`}>
      <div className="relative h-24 w-full">
        <textarea
          id={`textarea_${textareaId}`}
          name={name}
          aria-label={label}
          className={cn(
            TextareaVariants({ invalid: isInvalid }),
            additionalClass,
          )}
          placeholder=" "
          ref={textareaRef}
          value={value}
          readOnly={isReadOnly}
          disabled={isDisabled}
          onInvalid={handleInvalid}
          required={required.isRequired}
          onChange={handleChange}
        />
        <label
          id={`textarea_${textareaId}`}
          ref={labelRef}
          className={cn(LabelVariants({ invalid: isInvalid }))}
        >
          {label}
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
Textarea.displayName = "Textarea";
