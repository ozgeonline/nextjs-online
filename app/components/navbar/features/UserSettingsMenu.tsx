"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/utils/auth"
import userImg from "@/public/avatar.png"
import { Pencil, FolderSync, UserRound, HelpCircle } from 'lucide-react'
import SignOutButton from "./SignOutButton"
import Image  from "next/image"
import UserSettingsToggleButton from "./UserSettingsToggleButton"
import styles from "../navbar.module.css"

export default async function UserSettingsMenu() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return undefined;
  }

  const avatarSrc = session.user?.image || {userImg}
  const userShortName = session.user?.name?.slice(0, 2) || "un"
  const userName = session.user?.name
  const userMail = session.user?.email

  return (
    <div className="relative">
      <UserSettingsToggleButton
        userImg={avatarSrc as string}
        userShortName={userShortName}
      >
        <div className="w-56 text-start rounded-none mt-6 pt-5 space-y-2 bg-black/90">

          {/* User info */}
          <div className="px-3 flex">
            <Image 
              src={userImg} 
              alt="user image" 
              className="rounded-sm size-7 hover:cursor-pointer"
            />
            <div className="flex flex-col space-y-2 ps-2">
              <p className="text-sm font-medium leading-none hover:underline hover:cursor-pointer">
                {userName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {userMail}
              </p>
            </div>
          </div>

          {/* Menu Info */}
          <div className="px-3 space-y-1 *:hover:cursor-not-allowed *:flex *:items-center">
            <div className="hover:underline">
              <Pencil className={styles.infoIcon} />
              <span className="ps-2">Manage Profiles</span>
            </div>

            <div className="hover:underline">
              <FolderSync className={styles.infoIcon}/>
              <span className="ps-2">Transfer Profiles</span>
            </div>

            <div className="hover:underline">
              <UserRound className={styles.infoIcon}/>
              <span className="ps-2">Account</span>
            </div>
            
            <div className="hover:underline">
              <HelpCircle className={styles.infoIcon}/>
              <span className="ps-2">Help Center</span>
            </div>
          </div>

          {/* User Sign Out Button */}
          <SignOutButton />
        </div>
      
      </UserSettingsToggleButton>
    </div>
  )
}