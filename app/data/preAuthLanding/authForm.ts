import { LocalizedText } from "./types";

type AuthFormCopy = {
  common: {
    passwordPlaceholder: LocalizedText
    rememberMe: LocalizedText
    needHelp: LocalizedText
    pleaseWait: LocalizedText
    recaptchaText: LocalizedText
    learnMore: LocalizedText
    passwordHelpText: LocalizedText
  }
  login: {
    title: LocalizedText
    linkTitle: LocalizedText
    linkInfo: LocalizedText
  }
  signup: {
    title: LocalizedText
    linkTitle: LocalizedText
    linkInfo: LocalizedText
  }
  errors: {
    linkedAccount: LocalizedText
    invalidCredentials: LocalizedText
    invalidSignupDetails: LocalizedText
    duplicateEmail: LocalizedText
  }
}

export const authFormCopy = {
  common: {
    passwordPlaceholder: {
      en: "Password",
      tr: "Şifre",
    },
    rememberMe: {
      en: "Remember me",
      tr: "Beni hatırla",
    },
    needHelp: {
      en: "Need help?",
      tr: "Yardıma mı ihtiyacın var?",
    },
    pleaseWait: {
      en: "Please wait...",
      tr: "Lütfen bekleyin...",
    },
    recaptchaText: {
      en: "This page is protected by Google reCAPTCHA to ensure you are not a bot.",
      tr: "Bu sayfa, bot olmadığınızdan emin olmak için Google reCAPTCHA ile korunmaktadır.",
    },
    learnMore: {
      en: "Learn more.",
      tr: "Daha fazla bilgi.",
    },
    passwordHelpText: {
      en: "Use at least 8 characters.",
      tr: "En az 8 karakter kullan.",
    },
  },
  login: {
    title: {
      en: "Log in",
      tr: "Oturum Aç",
    },
    linkTitle: {
      en: "Need help? ",
      tr: "Hesabın yok mu? ",
    },
    linkInfo: {
      en: "Sign up now!",
      tr: "Şimdi kaydol!",
    },
  },
  signup: {
    title: {
      en: "Sign Up",
      tr: "Kaydol",
    },
    linkTitle: {
      en: "Already have an account? ",
      tr: "Zaten hesabın var mı? ",
    },
    linkInfo: {
      en: "Log in now.",
      tr: "Şimdi oturum aç.",
    },
  },
  errors: {
    linkedAccount: {
      en: "You already signed in with this email using {provider}. Continue with {provider}, or use a different email address.",
      tr: "Bu e-posta adresiyle daha önce {provider} kullanarak oturum açtınız. {provider} ile devam edin veya farklı bir e-posta adresi deneyin.",
    },
    invalidCredentials: {
      en: "Invalid email or password.",
      tr: "E-posta adresi veya şifre hatalı.",
    },
    invalidSignupDetails: {
      en: "Enter a valid email and a password with at least 8 characters.",
      tr: "Geçerli bir e-posta adresi ve en az 8 karakterli bir şifre gir.",
    },
    duplicateEmail: {
      en: "Unable to create an account with these details. This email address is already registered.",
      tr: "Bu bilgilerle hesap oluşturulamıyor. Bu e-posta adresi zaten kayıtlı.",
    },
  },
} satisfies AuthFormCopy;
