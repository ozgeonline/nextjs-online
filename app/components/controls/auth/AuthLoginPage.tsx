"use client"

import { FormEvent, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { LandingContent, Locale } from "@/app/data/preAuthLandingContent"
import { signUpWithCredentials } from "@/app/utils/auth-actions"
import styles from "./controlsSignin.module.css"

import GithubSignInButton from "@/app/components/controls/button/auth/Github__SignIn_Button";
import GoogleSignInButton from "@/app/components/controls/button/auth/Google__SignIn_Button";
import AuthEmailInput from "./AuthEmailInput";
import Footer from "@/app/components/ui/preAuthLanding/Footer";

type AuthLoginPageProps = {
  mode: "login" | "signup"
  locale: Locale
  authContent: LandingContent["auth"]
  emailInputContent: LandingContent["emailInput"]
  footerContent: LandingContent["footer"]
}

export default function AuthLoginPage({
  mode,
  locale,
  authContent,
  emailInputContent,
  footerContent,
}: AuthLoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("authError");
  const provider = searchParams.get("provider");
  const modeContent = authContent[mode];
  const linkRef = mode === "login" ? "/sign-up" : "/login";
  const localizedLinkRef = locale === "tr" ? `${linkRef}?lang=tr` : linkRef;
  const linkedAccountMessage = authError === "account-linked" && provider
    ? authContent.errors.linkedAccount.replaceAll("{provider}", provider)
    : "";
  const [formError, setFormError] = useState(linkedAccountMessage);
  const [isPending, startTransition] = useTransition();
  const submitButtonText = isPending ? authContent.common.pleaseWait : modeContent.title;
  const passwordHelpText = mode === "signup" ? authContent.common.passwordHelpText : undefined;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const remember = formData.get("remember") === "on";

    startTransition(async () => {
      if (mode === "signup") {
        const result = await signUpWithCredentials(formData);

        if (result.error) {
          setFormError(result.error === "DUPLICATE_EMAIL"
            ? authContent.errors.duplicateEmail
            : authContent.errors.invalidSignupDetails
          );
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        remember: String(remember),
        redirect: false,
      });

      if (result?.error) {
        setFormError(authContent.errors.invalidCredentials);
        return;
      }

      router.push("/home");
      router.refresh();
    });
  };

  return (
    <div className=" z-10">
      <div className={styles["form-wrapper-style"]}>
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-80"
        >
          <h1 className="text-3xl font-semibold text-white pt-2">
            {modeContent.title}
          </h1>
          <div className="space-y-7 mt-5">
            <AuthEmailInput
              placeholder={emailInputContent.placeholder}
              errorMessage={emailInputContent.errorMessage}
              inputWrapper="relative"
              inputStyle="bg-main-gray md:w-80 py-3 px-6"
              errorMessageClassName="text-main-login_input_info_color"
              validInputClassName="border-none"
              invalidInputClassName="border-b-2 border-main-login_input_info_color outline-none"
            >
              <input
                type="password"
                name="password"
                placeholder={authContent.common.passwordPlaceholder}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={8}
                maxLength={128}
                required
                className="bg-main-gray opacity-80 rounded-sm w-full md:w-80 py-3 px-6 mt-8"
              />
            </AuthEmailInput>
            {passwordHelpText && (
              <p className="text-xs text-muted-foreground -mt-4">
                {passwordHelpText}
              </p>
            )}
            {formError && (
              <p className="text-xs text-inputInfo-err_color" role="alert">
                {formError}
              </p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="bg-main-red w-full md:w-80 py-3 rounded-sm"
            >
              {submitButtonText}
            </button>
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="size-4"
                  defaultChecked={mode === "login"}
                />
                <label
                  htmlFor="remember"
                  className="text-xs font-medium leading-none"
                >
                  {authContent.common.rememberMe}
                </label>
              </div>
              <div className="text-xs text-muted-foreground">
                {authContent.common.needHelp}
              </div>
            </div>
          </div>
        </form>

        <div className="text-muted-foreground text-xs min-[280px]:text-sm mt-2">
          {modeContent.linkTitle}
          <Link
            className="text-white hover:underline"
            href={localizedLinkRef}
            prefetch={true}
          >
            {modeContent.linkInfo}
          </Link>
        </div>

        <div className="flex w-full justify-center items-center gap-x-3 mt-6">
          <GithubSignInButton />
          <GoogleSignInButton />
        </div>

        <div className="text-muted-foreground text-xs mt-5 w-full md:w-80">
          {authContent.common.recaptchaText}
          <Link href="#" className="text-blue-600">
            {authContent.common.learnMore}
          </Link>
        </div>
      </div>

      <div className="md:mt-14">
        <Footer
          contactText={footerContent.contactText}
          brand={footerContent.brand}
          links={footerContent.links}
        />
      </div>
    </div>
  )
}
