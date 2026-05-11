import footerLinks from "@/app/data/footerLinks"
import LanguageSelect from "@/app/components/ui/preAuthLanding/Lang_Selection"

export default function Footer() {
  return (
    <div className="py-10 border-t-8 bg-black">
      <div className="mx-auto max-w-[1170px] px-4 md:px-8">
        <div className="mb-2 underline text-main-white_100">
          Questions? Contact us.
        </div>
        <ul className="grid max-[350px]:grid-cols-1 grid-cols-2 md:grid-cols-4">
          {footerLinks.map((link) => (
            <li key={link.id} className="text-sm underline text-main-white_100 mt-3">
              {link.title}
            </li>
          ))}
        </ul>
        <div className="w-16 sm:w-32 mt-5 cursor-default">
          <LanguageSelect />
        </div>
        <p className="text-main-white_100 text-sm mt-5">
          ozgeonline
        </p>
      </div>
    </div>
  )
}
