import { LocalizedFAQItem, LocalizedText } from "./types";

type FAQCopy = {
  title: LocalizedText
  readyText: LocalizedText
  items: LocalizedFAQItem[]
}

export const faqCopy = {
  title: {
    en: "Frequently Asked Questions",
    tr: "Sıkça Sorulan Sorular",
  },
  readyText: {
    en: "Ready to watch? Enter your email to create or restart your membership.",
    tr: "İzlemeye hazır mısın? Üyeliğini oluşturmak veya yeniden başlatmak için e-posta adresini gir.",
  },
  items: [
    {
      id: 1,
      title: {
        en: "What is this?",
        tr: "Bu servis nedir?",
      },
      content: {
        en: "This service lets you stream movies and TV shows online with a personal account.",
        tr: "Bu servis, kişisel hesabınla film ve dizileri çevrim içi izleyebileceğin bir yayın deneyimi sunar.",
      },
    },
    {
      id: 2,
      title: {
        en: "How much does the service cost?",
        tr: "Servisin ücreti ne kadar?",
      },
      content: {
        en: "Plan details can be updated based on the membership model used by the project.",
        tr: "Plan bilgileri, projede kullanılacak üyelik modeline göre güncellenebilir.",
      },
    },
    {
      id: 3,
      title: {
        en: "Where can I watch?",
        tr: "Nerede izleyebilirim?",
      },
      content: {
        en: "You can watch on supported phones, tablets, laptops, and TVs.",
        tr: "Desteklenen telefon, tablet, bilgisayar ve televizyonlarda izleyebilirsin.",
      },
    },
    {
      id: 4,
      title: {
        en: "How do I cancel?",
        tr: "Nasıl iptal ederim?",
      },
      content: {
        en: "Membership cancellation can be managed from the account area when billing features are enabled.",
        tr: "Faturalandırma özellikleri aktif olduğunda üyelik iptali hesap alanından yönetilebilir.",
      },
    },
    {
      id: 5,
      title: {
        en: "What can I watch?",
        tr: "Ne izleyebilirim?",
      },
      content: {
        en: "You can browse movies, shows, and curated categories from the home screen.",
        tr: "Ana sayfadan filmleri, dizileri ve seçilmiş kategorileri keşfedebilirsin.",
      },
    },
    {
      id: 6,
      title: {
        en: "Is the service good for kids?",
        tr: "Servis çocuklar için uygun mu?",
      },
      content: {
        en: "Kid-friendly profiles and age-based browsing can help create a safer viewing experience.",
        tr: "Çocuk profilleri ve yaşa göre içerik deneyimi daha güvenli bir izleme alanı oluşturabilir.",
      },
    },
  ],
} satisfies FAQCopy;
