"use client";

import { normalizeLocale, preAuthLandingContent } from "@/app/data/preAuthLandingContent";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./auth.module.css"

export default function SignInLink() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get("lang"));
  const content = preAuthLandingContent[locale];
  const href = locale === "tr" ? "/sign-up?lang=tr" : "/sign-up";

  return (
    <Link
      href={href}
      className={styles.signInButton}
      aria-label={content.signIn}
    >
      {content.signIn}
    </Link>
  )
}
