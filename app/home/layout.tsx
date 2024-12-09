import { getServerSession } from "next-auth"
import { authOptions } from "../utils/auth"
import { redirect } from "next/navigation"

export default async function HomeLayout(){
  const session = await getServerSession(authOptions)

  if(!session) {
    redirect("/tr-en")
  }

  return (
    <div className="w-full">
      Hello World!
    </div>
  )
}