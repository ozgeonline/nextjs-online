"use client";

import { normalizeLocale, preAuthLandingContent } from "@/app/data/preAuthLandingContent";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "../controlsButton.module.css"

export default function SignIn_Button() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get("lang"));
  const content = preAuthLandingContent[locale];
  const href = locale === "tr" ? "/sign-up?lang=tr" : "/sign-up";

  return (
    <Link
      href={href}
      type="submit"
      className={styles.signInButton}
      aria-label="Sign In Button"
    >
      {content.signIn}
    </Link>
  )
}
