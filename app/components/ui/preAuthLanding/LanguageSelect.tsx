"use client";

import type { Locale } from "@/app/data/preAuthLandingContent";
import { normalizeLocale } from "@/app/data/preAuthLandingContent";
import { Languages } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export default function LanguageSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedLocale = normalizeLocale(searchParams.get("lang"));

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    const params = new URLSearchParams(searchParams.toString());

    params.set("lang", nextLocale);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center relative space-x-3 bg-main-dark/80 border border-muted-foreground rounded-sm">
      <Languages className="absolute size-4 ml-2" aria-hidden="true" />
      <label htmlFor="language" className="sr-only">
        Select language
      </label>
      <select
        aria-label="Select language"
        name="language"
        id="language"
        value={selectedLocale}
        onChange={handleLanguageChange}
        className="py-1 px-3 outline-none bg-main-dark/10 rounded-sm text-[0.85rem] size-8 sm:w-24 *:bg-main-white_100 *:text-black"
      >
        <option value="en">English</option>
        <option value="tr">Turkish</option>
      </select>
    </div>
  );
}