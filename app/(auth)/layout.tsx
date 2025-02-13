import { ReactNode } from "react"
import dynamic from "next/dynamic"

const Background_Img = dynamic(() => import("../components/ui/assets/Background_Img"));
const Logo_Img = dynamic(() => import("../components/ui/assets/Logo_Img"));
const Lang_Selection = dynamic(() => import("../components/ui/preAuthLanding/Lang_Selection"));
const SignIn_Button = dynamic(() => import("../components/controls/button/auth/SignIn_Button"));

export default function AuthLayout({children}:{children: ReactNode}){
  return (
    <main className="flex flex-col relative">
      <Background_Img />
      <div
        className="absolute top-0 left-0 h-[10vw] w-screen bg-gradient-to-t from-transparent via-black/80 to-black/80"
      ></div>
      <div className="absolute w-screen h-[80vh] sm:h-[95vh]">
        <Logo_Img
          logoStyle="absolute top-0 left-0 h-6 w-24 mx-[15vw] my-5 md:h-10 md:w-36 md:mx-[10vw]"
        />
        <div
          className="z-50 flex items-center absolute top-10 space-x-2 h-6 my-5 mx-[15vw] sm:top-0 sm:right-0 md:h-8 md:me-44"
        >
          <Lang_Selection />
          <SignIn_Button />
        </div>
      </div>
      {children}
    </main>
  )
}