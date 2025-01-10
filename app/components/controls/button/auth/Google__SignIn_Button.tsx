"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image"
import GoogleIcon from "@/public/google.svg"
import styles from "../controlsButton.module.css"
import { signIn } from "next-auth/react"

export default function GoogleSignInButton() {
  return (
    <Button 
      onClick={() => signIn('google')}
      variant="default" 
      size="icon"
      className={styles.iconBtn}
    >
      <Image 
        src={GoogleIcon} 
        alt="Google icon" 
        className="size-7" 
        loading="lazy"
      />
    </Button>
  )
}