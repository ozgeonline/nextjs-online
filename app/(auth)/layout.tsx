import { ReactNode, Suspense } from "react"
import dynamic from "next/dynamic"

const AuthBackgroundImage = dynamic(() => import("@/app/components/ui/assets/AuthBackgroundImage"));
const LogoImage = dynamic(() => import("@/app/components/ui/assets/LogoImage"));
const Lang_Selection = dynamic(() => import("@/app/components/ui/preAuthLanding/Lang_Selection"));
const SignInLink = dynamic(() => import("@/app/components/controls/auth/SignInLink"));

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col relative">
      <>
        <AuthBackgroundImage />
        <div
          className="absolute top-0 left-0 h-[10vw] w-screen bg-gradient-to-t from-transparent via-black/80 to-black/80"
        ></div>
      </>
      <div className="absolute w-screen h-[80vh] sm:h-[95vh]">
        <LogoImage
          logoStyle="absolute top-0 left-0 my-5 h-6 md:h-10 w-24 md:w-36 mx-[15vw] md:mx-[10vw]"
        />
        <div
          className="z-50 flex items-center absolute top-10 sm:top-0 sm:right-0 space-x-2 h-6 md:h-8 my-5 mx-[15vw] md:me-44"
        >
          <Suspense fallback={null}>
            <Lang_Selection />
            <SignInLink />
          </Suspense>
        </div>
      </div>
      {children}
    </main>
  )
}
