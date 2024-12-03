"use client"

import { 
  useState, 
  useCallback, 
  useMemo, 
  useRef, 
  useEffect, 
  ReactNode, 
  ChangeEvent
} from "react";

import debounce from 'lodash.debounce';
import styles from "../controls.module.css"

type UserLoginInputModalProps = {
  children?:ReactNode
  inputStyle?:string
  inputWrapper?:string
  errorMsgColor?:string
  validValueColor?:string
  invalidValueColor?:string
}
export default function LoginInputModal({
  children,
  inputStyle,
  inputWrapper,
  errorMsgColor,
  validValueColor,
  invalidValueColor,
}:UserLoginInputModalProps) {

  const [inputValue, setInputValue] = useState<string>("")
  const [isTouched, setIsTouched] = useState<boolean>(false)
  
  // Trigger limiter when entering values ​​from the input to help optimize performance
  const debouncedHandleInputChange = useRef(
    debounce((value: string) => {
      setInputValue(value);
    }, 50)
  ).current;

  useEffect(() => {
    return () => {
      debouncedHandleInputChange.cancel();
    };
  }, [debouncedHandleInputChange]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const inputType = (event.nativeEvent as InputEvent).inputType;
    
    if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') {
      debouncedHandleInputChange.cancel();
      setInputValue(value);
    } else {
      debouncedHandleInputChange(value);
    }
    //console.log(value)
  };

  const handleInputBlur = useCallback(() => {
    setIsTouched(true);
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const emailIsValid = useMemo(() => validateEmail(inputValue), [inputValue, validateEmail]);

  return (
    <div className={inputWrapper}>
      <input
        type="email"
        name="email"
        placeholder="Email address"
        value={inputValue}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        autoComplete="email"
        required
        className={`
          ${styles['input-field']}
          w-full
          ${inputStyle}
          ${(inputValue && emailIsValid) ? `${validValueColor}`
            : (!inputValue || !emailIsValid) && isTouched ? `${invalidValueColor}` 
            : "border border-muted-foreground"
          }
        `}
      />

      {isTouched && !emailIsValid && (
        <label 
          htmlFor="email"
          className={`
            ${errorMsgColor}
            absolute top-14 left-0 w-full max-w-[370px] text-xs sm:text-sm text-start
          `}
        >
          Please enter a valid email address.
        </label>
      )}

      <div 
        className={`
          ${isTouched && !emailIsValid && "max-sm:mt-7"}
        `}
      >
        {children}
      </div>
    </div>
  )
}