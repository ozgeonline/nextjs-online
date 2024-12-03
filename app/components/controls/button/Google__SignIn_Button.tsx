"use client"

import {Button, ButtonGroup} from "@nextui-org/button";
import Image from "next/image"
import GoogleIcon from "../../../../public/google.svg"
import { signIn } from "next-auth/react"

export default function GoogleSignInButton() {
  return (
    <Button onClick={() => signIn('google')}>
      <Image src={GoogleIcon} alt="Google icon" className="size-6" loading="lazy"/>
    </Button>
  )
}