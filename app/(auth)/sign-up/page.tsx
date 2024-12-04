import AuthLoginPage from "@/app/components/controls/input/AuthLoginPage"
import { authOptions } from "@/app/utils/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function SignUp() {

  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/home")
  }

  return (
    <AuthLoginPage
      title="Sign Up"
      buttonTitle="Sign Up"
      linkTitle="Alredy Have a account? "
      linkInfo="Log in now."
      linkRef="/login"
    />
  )
}