"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import GithubIcon from "@/public/github.svg"
import styles from "../controlsButton.module.css"
import { signIn } from "next-auth/react";

export default function GithubSignInButton() {
  return (
    <Button 
      onClick={()=> signIn('github')}
      variant="default" 
      size="icon" 
      className={styles.iconBtn}
    >
      <Image 
        src={GithubIcon}
        alt="Github icon"
        className="size-6"
        loading="lazy"
      />
    </Button>
  )
}