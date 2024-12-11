"use client"

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function UserSignOutButton() {
  return (
    <Button 
      onClick={() => signOut()} 
      className="w-full cursor-pointer hover:underline hover:bg-black/90 bg-black/90 text-white rounded-none border-t"
    >
      Sign out
    </Button>
  )
}