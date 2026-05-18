"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image"
import GoogleIcon from "@/public/google.svg"
import styles from "./auth.module.css"
import { signIn } from "next-auth/react"

export default function GoogleSignInButton() {
  return (
    <Button
      type="button"
      aria-label="Sign in with Google"
      onClick={() => signIn('google', { callbackUrl: '/home' })}
      variant="default"
      size="icon"
      className={styles.iconBtn}
    >
      <Image
        src={GoogleIcon}
        alt=""
        className="size-7"
        loading="lazy"
      />
    </Button>
  )
}
