import AuthLoginPage from "@/app/components/controls/auth/AuthLoginPage"
import { authOptions } from "@/app/utils/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
export default async function SignUp() {

  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    return redirect("/home")
  }

  return (
    <AuthLoginPage
      title="Sign Up"
      linkTitle="Already have an account? "
      linkInfo="Log in now."
      linkRef="/login"
    />
  )
}