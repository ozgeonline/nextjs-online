import { ChevronRight } from "lucide-react";
import LoginInputModal from "./LoginInputModal";

export default function LoginInput() {
  return (
    <>
    <form 
      method="post" 
      action="/api/auth/signin" 
      className="flex flex-col sm:flex-row w-full items-center justify-center sm:space-x-2 max-sm:space-y-10"
    >
      <LoginInputModal
        inputWrapper="relative flex flex-col max-sm:w-full "
        inputStyle="bg-main-dark sm:w-[370px] h-12 sm:h-14"
        errorMsgColor="text-inputInfo-err_color"
        validValueColor="border-2 border-inputInfo-succ_color"
        invalidValueColor="border-2 border-inputInfo-err_color"
      />
      <button 
        type="submit"
        className="z-10 flex items-center justify-center rounded-sm text-lg sm:text-2xl bg-main-red hover:brightness-90 w-40 sm:w-52 h-12 sm:h-14"
      >
        Get Started 
        <ChevronRight className="ml-2 max-sm:p-1" size="32px"/>
      </button>
    </form>
  </>
  )
}