export const supportedLocales = ["en", "tr"] as const;

export type Locale = typeof supportedLocales[number];

export type LocalizedText = Record<Locale, string>;

export type LocalizedFeature = {
  id: number
  title: LocalizedText
  description: LocalizedText
  imageSrc: string
}

export type LocalizedFAQItem = {
  id: number
  title: LocalizedText
  content: LocalizedText
}

export type LandingFeature = {
  id: number
  title: string
  description: string
  imageSrc: string
}

export type FAQItem = {
  id: number
  title: string
  content: string
}

export type LandingContent = {
  languageName: string
  signIn: string
  hero: {
    title: string
    subtitle: string
    description: string
  }
  emailInput: {
    placeholder: string
    errorMessage: string
    submitLabel: string
  }
  auth: {
    common: {
      passwordPlaceholder: string
      rememberMe: string
      needHelp: string
      pleaseWait: string
      recaptchaText: string
      learnMore: string
      passwordHelpText: string
    }
    login: {
      title: string
      linkTitle: string
      linkInfo: string
    }
    signup: {
      title: string
      linkTitle: string
      linkInfo: string
    }
    errors: {
      linkedAccount: string
      invalidCredentials: string
      invalidSignupDetails: string
      duplicateEmail: string
    }
  }
  features: LandingFeature[]
  faq: {
    title: string
    readyText: string
    items: FAQItem[]
  }
  footer: {
    contactText: string
    brand: string
    links: readonly string[]
  }
}
