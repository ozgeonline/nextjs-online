import { LocalizedText } from "./types";

type HeroCopy = {
  title: LocalizedText
  subtitle: LocalizedText
  description: LocalizedText
}

export const heroCopy = {
  title: {
    en: "Unlimited movies, TV shows, and more",
    tr: "Sınırsız film, dizi ve çok daha fazlası",
  },
  subtitle: {
    en: "Watch anywhere. Cancel anytime.",
    tr: "İstediğin yerde izle. İstediğin zaman iptal et.",
  },
  description: {
    en: "Ready to watch? Enter your email to create or restart your membership.",
    tr: "İzlemeye hazır mısın? Üyeliğini oluşturmak veya yeniden başlatmak için e-posta adresini gir.",
  },
} satisfies HeroCopy;
