"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { memo } from "react"
import styles from "./controlsInput.module.css"

const GithubSignInButton = dynamic(() => import("@/app/components/controls/button/Github__SignIn_Button"));
const GoogleSignInButton = dynamic(() => import("@/app/components/controls/button/Google__SignIn_Button"));
const LoginInputModal = dynamic(() => import("./LoginInputModal"));
const Footer = dynamic(() => import("@/app/components/ui/preAuthLanding/Footer"));

type formInfo = {
  title: string
  linkTitle: string
  linkInfo: string
  linkRef: string
}

const UserAuthLoginPage = ({
  title,
  linkTitle,
  linkInfo,
  linkRef
}: formInfo) => {
  return (
    <div className="mt-0 md:mt-28 z-10">
      <div className={`${styles['form-wrapper-style']} `}>
        <form 
          method="post"
          action="/api/auth/signin"
          encType="multipart/form-data"
          className="w-full md:w-80"
        >
          <h1 className="text-3xl font-semibold text-white pt-2">
            {title}
          </h1>
          <div className="space-y-7 mt-5">
            <LoginInputModal
              inputWrapper="relative"
              inputStyle="bg-main-gray md:w-80 py-3 px-6"
              errorMsgColor="text-main-login_input_info_color"
              validValueColor="border-none"
              invalidValueColor="border-b-2 border-main-login_input_info_color outline-none"
            >
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
                disabled
                className="bg-main-gray opacity-80 rounded-sm w-full md:w-80 py-3 px-6 cursor-not-allowed mt-8"
              />
            </LoginInputModal>
            <button
              type="submit"
              className="bg-main-red w-full md:w-80 py-3 rounded-sm"
            >
              {title}
            </button>
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="checkbox"
                  name="checkbox"
                  aria-label="checkbox"
                  className="cursor-not-allowed size-4 opacity-50"
                  checked
                  disabled
                />
                <label
                  htmlFor="checkbox"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <div className="text-xs cursor-pointer text-muted-foreground hover:underline">
                Need help?
              </div>
            </div>
          </div>
        </form>

        <div className="text-muted-foreground text-xs min-[280px]:text-sm mt-2">
          {linkTitle}
          <Link 
            className="text-white hover:underline"
            href={linkRef}
            prefetch={true}
          >
            {linkInfo}
          </Link>
        </div>

        <div className="flex w-full justify-center items-center gap-x-3 mt-6">
          <GithubSignInButton />
          <GoogleSignInButton />
        </div>

        <div className="text-muted-foreground text-xs mt-5 w-full md:w-80">
          This page is protected by Google reCAPTCHA to ensure you are not a bot. 
          <span className="text-blue-600 hover:underline hover:cursor-pointer">
            Learn more.
          </span>
        </div>
      </div>
      
      <div className="md:mt-14">
        <Footer />
      </div>
    </div>
  )
}

export default memo(UserAuthLoginPage);