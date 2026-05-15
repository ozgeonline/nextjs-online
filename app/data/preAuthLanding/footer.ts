import { LocalizedText } from "./types";

type FooterCopy = {
  contactText: LocalizedText
  brand: string
  links: LocalizedText[]
}

export const footerCopy = {
  contactText: {
    en: "Questions? Contact us.",
    tr: "Sorularınız mı var? Bize ulaşın.",
  },
  brand: "ozgeonline",
  links: [
    {
      en: "FAQ",
      tr: "SSS",
    },
    {
      en: "Help Center",
      tr: "Yardım Merkezi",
    },
    {
      en: "Account",
      tr: "Hesap",
    },
    {
      en: "Media Center",
      tr: "Medya Merkezi",
    },
    {
      en: "Investor Relations",
      tr: "Yatırımcı İlişkileri",
    },
    {
      en: "Jobs",
      tr: "İş İlanları",
    },
    {
      en: "Redeem Gift Cards",
      tr: "Hediye Kartı Kullan",
    },
    {
      en: "Ways to Watch",
      tr: "İzleme Yolları",
    },
    {
      en: "Terms of Use",
      tr: "Kullanım Şartları",
    },
    {
      en: "Privacy",
      tr: "Gizlilik",
    },
    {
      en: "Cookie Preferences",
      tr: "Çerez Tercihleri",
    },
    {
      en: "Corporate Information",
      tr: "Kurumsal Bilgiler",
    },
    {
      en: "Contact Us",
      tr: "Bize Ulaşın",
    },
    {
      en: "Speed Test",
      tr: "Hız Testi",
    },
    {
      en: "Legal Notices",
      tr: "Yasal Bildirimler",
    },
    {
      en: "Only on service",
      tr: "Sadece serviste",
    },
  ],
} satisfies FooterCopy;
