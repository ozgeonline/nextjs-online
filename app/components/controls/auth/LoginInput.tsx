import { ChevronRight } from "lucide-react";
import AuthEmailInput from "./AuthEmailInput";
import styles from "./controlsSignin.module.css";

type LoginInputProps = {
  placeholder?: string
  errorMessage?: string
  submitLabel?: string
}

export default function LoginInput({
  placeholder,
  errorMessage,
  submitLabel = "Get Started",
}: LoginInputProps) {
  return (
    <form 
      method="post" 
      action="/api/auth/signin" 
      className="flex flex-col sm:flex-row w-full items-center justify-center sm:space-x-2 max-sm:space-y-10"
    >
      <AuthEmailInput
        placeholder={placeholder}
        errorMessage={errorMessage}
        inputWrapper="relative flex flex-col max-sm:w-full "
        inputStyle="bg-main-dark sm:w-[370px] h-12 sm:h-14"
        errorMessageClassName="text-inputInfo-err_color"
        validInputClassName="border-2 border-inputInfo-succ_color"
        invalidInputClassName="border-2 border-inputInfo-err_color"
      />
      <button 
        type="submit"
        className={styles.getStartedBtn}
      >
        {submitLabel}
        <ChevronRight className="ml-2 max-sm:p-1" size={32} />
      </button>
    </form>
  )
}
