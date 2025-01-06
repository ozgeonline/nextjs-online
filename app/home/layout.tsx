import { getServerSession } from "next-auth"
import { ReactNode, Suspense } from "react"
import { authOptions } from "../utils/auth"
import { redirect } from "next/navigation"
import Navbar from "../components/navbar/Navbar"
import BoxLoading_Animation from "../components/animation/BoxLoading_Animation"

export default async function HomeLayout({children} : {children: ReactNode}){
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/tr-en");
  }

  return (
    <div className="w-full">
      <Navbar />
      <Suspense fallback={<BoxLoading_Animation />}>
        <div className="w-full">
          {children}
        </div>
      </Suspense>
    </div>
  )
}