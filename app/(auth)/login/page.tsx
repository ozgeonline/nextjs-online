import AuthLoginPage from "@/app/components/controls/auth/AuthLoginPage"
import { getPreAuthLandingContent, normalizeLocale } from "@/app/data/preAuthLandingContent";
import { authOptions } from "@/app/utils/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams?: Promise<{
    lang?: string | string[]
  }>
}

export default async function Login({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    return redirect("/home")
  }

  const resolvedSearchParams = await searchParams;
  const locale = normalizeLocale(resolvedSearchParams?.lang);
  const content = getPreAuthLandingContent(locale);

  return (
    <AuthLoginPage
      mode="login"
      locale={locale}
      authContent={content.auth}
      emailInputContent={content.emailInput}
      footerContent={content.footer}
    />
  )
}
