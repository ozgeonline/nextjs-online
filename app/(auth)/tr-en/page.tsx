import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import LoginInput from "@/app/components/controls/signin/LoginInput";

const CardAnimationWatch = dynamic(() => import("@/app/components/ui/preAuthLanding/CardAnimationWatch"));
const FAQ = dynamic(() => import("@/app/components/ui/preAuthLanding/FAQ"));
const Footer = dynamic(() => import("@/app/components/ui/preAuthLanding/Footer"));

export default async function Tr() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    return redirect("/home")
  }
  
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
          <h3 className="md:text-xl">
            Ready to watch? Enter your email to create or restart your membership.
          </h3>
        </div>
        <LoginInput />
      </div>

      <div>
        <CardAnimationWatch />
        <FAQ />
        <Footer />
      </div>
    </div>
  )  
}