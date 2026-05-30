import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/utils/auth";
import LoginInput from "@/app/components/controls/auth/LoginInput";
import LandingFeatureSections from "@/app/components/ui/preAuthLanding/LandingFeatureSections";
import FAQ from "@/app/components/ui/preAuthLanding/FAQ";
import Footer from "@/app/components/layout/Footer";
import { normalizeLocale, preAuthLandingContent } from "@/app/data/preAuthLandingContent";

type TrPageProps = {
  searchParams?: Promise<{
    lang?: string | string[]
  }>
}

export default async function Tr({ searchParams }: TrPageProps) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    return redirect("/home")
  }

  const resolvedSearchParams = await searchParams;
  const locale = normalizeLocale(resolvedSearchParams?.lang);
  const content = preAuthLandingContent[locale];

  return (
    <div className="flex flex-col">

      <div className="flex flex-col text-center items-center justify-center h-[80vh] sm:h-[95vh] px-8 space-y-8 sm:space-y-4">
        <div className="space-y-2">
          <h1 className="max-[350px]:text-lg text-3xl md:text-5xl font-black">
            {content.hero.title}
          </h1>
          <h2 className="md:text-4xl">
            {content.hero.subtitle}
          </h2>
          <h3 className="md:text-xl">
            {content.hero.description}
          </h3>
        </div>
        <LoginInput
          placeholder={content.emailInput.placeholder}
          errorMessage={content.emailInput.errorMessage}
          submitLabel={content.emailInput.submitLabel}
        />
      </div>

      <LandingFeatureSections features={content.features} />
      <FAQ
        faq={content.faq}
        emailInput={content.emailInput}
      />
      <Footer
        contactText={content.footer.contactText}
        brand={content.footer.brand}
        links={content.footer.links}
      />
    </div>
  )
}
