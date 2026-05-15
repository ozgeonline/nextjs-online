import LanguageSelect from "@/app/components/ui/preAuthLanding/Lang_Selection"
import { preAuthLandingContent } from "@/app/data/preAuthLandingContent"

type FooterProps = {
  contactText?: string
  brand?: string
  links?: readonly string[]
}

export default function Footer({
  contactText = "Questions? Contact us.",
  brand = "ozgeonline",
  links = preAuthLandingContent.en.footer.links,
}: FooterProps) {
  return (
    <div className="py-10 border-t-8 bg-black">
      <div className="mx-auto max-w-[1170px] px-4 md:px-8">
        <div className="mb-2 underline text-main-white_100">
          {contactText}
        </div>
        <ul className="grid max-[350px]:grid-cols-1 grid-cols-2 md:grid-cols-4">
          {links.map((link) => (
            <li key={link} className="text-sm underline text-main-white_100 mt-3">
              {link}
            </li>
          ))}
        </ul>
        <div className="w-16 sm:w-32 mt-5 cursor-default">
          <LanguageSelect />
        </div>
        <p className="text-main-white_100 text-sm mt-5">
          {brand}
        </p>
      </div>
    </div>
  )
}
