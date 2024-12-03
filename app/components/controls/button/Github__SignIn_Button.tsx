"use client"

import { signIn } from "next-auth/react";
import {Button} from "@nextui-org/button";
import Image from "next/image";
import GithubIcon from "../../../../public/github.svg"

export default function GithubSignInButton() {
  return (
    <Button onClick={()=> signIn('github')} className="size-4">
      <Image src={GithubIcon} alt="Google icon" className="size-6" loading="lazy"/>
    </Button>
  )
}