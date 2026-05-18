"use client"

import { ChangeEvent, ReactNode, useId, useState } from "react";
import styles from "./auth.module.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthEmailInputProps = {
  children?: ReactNode
  placeholder?: string
  errorMessage?: string
  inputStyle?: string
  inputWrapper?: string
  errorMessageClassName?: string
  validInputClassName?: string
  invalidInputClassName?: string
}

export default function AuthEmailInput({
  children,
  placeholder = "Email address",
  errorMessage = "Please enter a valid email address.",
  inputStyle,
  inputWrapper,
  errorMessageClassName,
  validInputClassName,
  invalidInputClassName,
}: AuthEmailInputProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [inputValue, setInputValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const emailIsValid = emailRegex.test(inputValue);
  const showError = isTouched && !emailIsValid;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const validationClassName = inputValue && emailIsValid
    ? validInputClassName
    : showError
      ? invalidInputClassName
      : "border border-muted-foreground";

  const inputClassName = [
    styles["input-field"],
    "w-full",
    inputStyle,
    validationClassName,
  ].filter(Boolean).join(" ");

  return (
    <div className={inputWrapper}>
      <input
        id={inputId}
        type="email"
        name="email"
        placeholder={placeholder}
        value={inputValue}
        onBlur={() => setIsTouched(true)}
        onChange={handleInputChange}
        autoComplete="email"
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
        required
        className={inputClassName}
      />

      {showError && (
        <p
          id={errorId}
          className={`
            ${errorMessageClassName}
            absolute top-14 left-0 w-full max-w-96 text-[10px] sm:text-sm text-start
          `}
        >
          {errorMessage}
        </p>
      )}

      <div className={showError ? "max-sm:mt-7" : undefined}>
        {children}
      </div>
    </div>
  )
}
