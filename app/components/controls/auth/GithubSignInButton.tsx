"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import GithubIcon from "@/public/github.svg"
import styles from "./auth.module.css"
import { signIn } from "next-auth/react";

export default function GithubSignInButton() {
  return (
    <Button
      type="button"
      aria-label="Sign in with GitHub"
      onClick={() => signIn('github', { callbackUrl: '/home' })}
      variant="default"
      size="icon"
      className={styles.iconBtn}
    >
      <Image
        src={GithubIcon}
        alt=""
        className="size-6"
        loading="lazy"
      />
    </Button>
  )
}
