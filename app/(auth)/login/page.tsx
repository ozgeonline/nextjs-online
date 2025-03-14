import AuthLoginPage from "@/app/components/controls/signin/AuthLoginPage"
import { authOptions } from "@/app/utils/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Login() {

  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    return redirect("/home")
  }

  return (
    <AuthLoginPage
      title="Log in"
      linkTitle="Need help? "
      linkInfo="Sign up now!"
      linkRef="/sign-up"
    />
  )
}