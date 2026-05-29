import { getServerSession } from "next-auth"
import { ReactNode, Suspense } from "react"
import { authOptions } from "@/app/utils/auth"
import { redirect } from "next/navigation"
import Navbar from "@/app/components/navbar/Navbar"
import BoxLoadingAnimation from "@/app/components/animation/BoxLoadingAnimation"

export default async function HomeLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/tr-en");
  }

  return (
    <div className="w-full relative">
      <Navbar />
      <div className="w-full h-full">
        <Suspense fallback={<BoxLoadingAnimation />}>
          {children}
        </Suspense>
      </div>
    </div>
  )
}