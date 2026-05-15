import { authFormCopy } from "./authForm";
import { emailInputCopy } from "./emailInput";
import { faqCopy } from "./faq";
import { featureCopy } from "./features";
import { footerCopy } from "./footer";
import { getLocalizedText, normalizeLocale } from "./localization";
import { languageNameCopy, signInCopy } from "./header";
import { heroCopy } from "./hero";
import { LandingContent, Locale, supportedLocales } from "./types";

export { normalizeLocale, supportedLocales };
export type { LandingContent, Locale };

export function getPreAuthLandingContent(locale: Locale): LandingContent {
  return {
    languageName: getLocalizedText(languageNameCopy, locale),
    signIn: getLocalizedText(signInCopy, locale),
    hero: {
      title: getLocalizedText(heroCopy.title, locale),
      subtitle: getLocalizedText(heroCopy.subtitle, locale),
      description: getLocalizedText(heroCopy.description, locale),
    },
    emailInput: {
      placeholder: getLocalizedText(emailInputCopy.placeholder, locale),
      errorMessage: getLocalizedText(emailInputCopy.errorMessage, locale),
      submitLabel: getLocalizedText(emailInputCopy.submitLabel, locale),
    },
    auth: {
      common: {
        passwordPlaceholder: getLocalizedText(authFormCopy.common.passwordPlaceholder, locale),
        rememberMe: getLocalizedText(authFormCopy.common.rememberMe, locale),
        needHelp: getLocalizedText(authFormCopy.common.needHelp, locale),
        pleaseWait: getLocalizedText(authFormCopy.common.pleaseWait, locale),
        recaptchaText: getLocalizedText(authFormCopy.common.recaptchaText, locale),
        learnMore: getLocalizedText(authFormCopy.common.learnMore, locale),
        passwordHelpText: getLocalizedText(authFormCopy.common.passwordHelpText, locale),
      },
      login: {
        title: getLocalizedText(authFormCopy.login.title, locale),
        linkTitle: getLocalizedText(authFormCopy.login.linkTitle, locale),
        linkInfo: getLocalizedText(authFormCopy.login.linkInfo, locale),
      },
      signup: {
        title: getLocalizedText(authFormCopy.signup.title, locale),
        linkTitle: getLocalizedText(authFormCopy.signup.linkTitle, locale),
        linkInfo: getLocalizedText(authFormCopy.signup.linkInfo, locale),
      },
      errors: {
        linkedAccount: getLocalizedText(authFormCopy.errors.linkedAccount, locale),
        invalidCredentials: getLocalizedText(authFormCopy.errors.invalidCredentials, locale),
        invalidSignupDetails: getLocalizedText(authFormCopy.errors.invalidSignupDetails, locale),
        duplicateEmail: getLocalizedText(authFormCopy.errors.duplicateEmail, locale),
      },
    },
    features: featureCopy.map((feature) => ({
      id: feature.id,
      title: getLocalizedText(feature.title, locale),
      description: getLocalizedText(feature.description, locale),
      imageSrc: feature.imageSrc,
    })),
    faq: {
      title: getLocalizedText(faqCopy.title, locale),
      readyText: getLocalizedText(faqCopy.readyText, locale),
      items: faqCopy.items.map((item) => ({
        id: item.id,
        title: getLocalizedText(item.title, locale),
        content: getLocalizedText(item.content, locale),
      })),
    },
    footer: {
      contactText: getLocalizedText(footerCopy.contactText, locale),
      brand: footerCopy.brand,
      links: footerCopy.links.map((link) => getLocalizedText(link, locale)),
    },
  };
}

export const preAuthLandingContent = {
  en: getPreAuthLandingContent("en"),
  tr: getPreAuthLandingContent("tr"),
} as const;
