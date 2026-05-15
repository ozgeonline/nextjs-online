import { LocalizedText } from "./types";

type EmailInputCopy = {
  placeholder: LocalizedText
  errorMessage: LocalizedText
  submitLabel: LocalizedText
}

export const emailInputCopy = {
  placeholder: {
    en: "Email address",
    tr: "E-posta adresi",
  },
  errorMessage: {
    en: "Please enter a valid email address.",
    tr: "Lütfen geçerli bir e-posta adresi gir.",
  },
  submitLabel: {
    en: "Get Started",
    tr: "Başlayın",
  },
} satisfies EmailInputCopy;
