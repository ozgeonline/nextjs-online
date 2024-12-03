import { ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const LoginInputModal = dynamic(() => import("@/app/components/controls/input/LoginInputModal"));
const CardAnimationWatch = dynamic(() => import("@/app/components/ui/preAuthLanding/CardAnimationWatch"));
const FAQ = dynamic(() => import("@/app/components/ui/preAuthLanding/FAQ"));
const Footer = dynamic(() => import("@/app/components/ui/Footer"));


export default async function Tr() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col text-center items-center justify-center h-[80vh] sm:h-[95vh] px-8 space-y-8 sm:space-y-4">
        <div className="space-y-2">
          <h1 className="max-[350px]:text-lg text-3xl md:text-5xl font-black">
            Unlimited movies, TV shows, and more
          </h1>
          <h2 className="md:text-4xl">
            Watch anywhere. Cancel anytime.
          </h2>
          <h2 className="md:text-xl">
            Ready to watch? Enter your email to create or restart your membership.
          </h2>
        </div>
       
        <>
          <form 
            method="post" 
            action="/api/auth/signin" 
            className="flex flex-col sm:flex-row w-full items-center justify-center sm:space-x-2 max-sm:space-y-2"
          >
            <LoginInputModal
              inputWrapper="relative flex flex-col max-sm:w-full"
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
      </div>
      <div>
        <CardAnimationWatch />
        <FAQ />
        <Footer />
      </div>
    </div>
  )  
}