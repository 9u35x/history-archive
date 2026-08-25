import { Person } from "@/types";

export const persons: Person[] = [
  {
    id: "saladin",
    name: "صلاح الدين الأيوبي",
    nameEn: "Saladin (Salah ad-Din Yusuf ibn Ayyub)",
    slug: "saladin",
    categories: ["قادة", "ملوك", "شخصيات عسكرية"],
    birthYear: 1137,
    deathYear: 1193,
    birthPlace: "تكريت (العراق الحالي)",
    deathPlace: "دمشق",
    civilization: "الدولة الأيوبية",
    role: "سلطان مصر والشام، قائد عسكري",
    shortBio:
      "مؤسس الدولة الأيوبية، اشتهر بقيادته في مواجهة الحملات الصليبية واستعادة القدس عام 1187م. يُعرف في المصادر الإسلامية والغربية بأخلاقه في الحرب والسياسة.",
    image: "/images/placeholder-person.svg",
    imageCredit: "صورة تمثيلية / ملكية عامة أو رخصة حرة عند التوفر",
    timeline: [
      {
        year: 1137,
        title: "الولادة",
        description: "وُلد في تكريت لعائلة كردية من أصول أيوبية.",
        type: "birth",
        sources: ["britannica-saladin", "lyons-jackson"],
      },
      {
        year: "حوالي 1169",
        title: "الوصول إلى السلطة في مصر",
        description: "أصبح وزيرًا في مصر تحت الفاطميين ثم أسس حكمه تدريجيًا.",
        type: "event",
        sources: ["britannica-saladin"],
      },
      {
        year: 1171,
        title: "إنهاء الخلافة الفاطمية",
        description: "أنهى الحكم الفاطمي في مصر وأعلن الولاء للخلافة العباسية.",
        type: "achievement",
        sources: ["britannica-saladin", "ibn-alathir"],
      },
      {
        year: 1187,
        title: "معركة حطين واستعادة القدس",
        description: "انتصار حاسم في حطين ثم دخول القدس في أكتوبر 1187.",
        type: "battle",
        sources: ["britannica-saladin", "lyons-jackson"],
      },
      {
        year: 1193,
        title: "الوفاة",
        description: "توفي في دمشق بعد مرض قصير.",
        type: "death",
        sources: ["britannica-saladin"],
      },
    ],
    achievements: [
      "توحيد مصر والشام تحت حكم أيوبي",
      "استعادة القدس عام 1187م",
      "قيادة المقاومة ضد الحملات الصليبية",
      "سياسات إدارية وعسكرية ساهمت في استقرار المنطقة نسبيًا",
    ],
    battles: ["hattin"],
    relatedPersons: [],
    contemporaryStates: ["الدولة الأيوبية", "المملكة الصليبية في القدس", "الدولة العباسية"],
    famousQuotes: [
      {
        text: "أقوال منسوبة إليه تتداول في الأدبيات، لكن التحقق من صيغتها الحرفية يحتاج مصادر أولية دقيقة.",
        uncertain: true,
        source: "مصادر ثانوية متعددة",
      },
    ],
    sources: ["britannica-saladin", "lyons-jackson", "ibn-alathir"],
    last24Hours: [
      {
        time: "غير محدد بدقة",
        event: "تفاصيل الساعات الأخيرة غير موثقة بدقة في المصادر المتاحة هنا.",
        uncertain: true,
        note: "تختلف الروايات في التفاصيل الدقيقة ليوم الوفاة.",
      },
    ],
  },
  {
    id: "hulagu",
    name: "هولاكو خان",
    nameEn: "Hulagu Khan",
    slug: "hulagu",
    categories: ["قادة", "شخصيات عسكرية"],
    birthYear: "حوالي 1217",
    deathYear: 1265,
    birthPlace: "منغوليا",
    civilization: "الإمبراطورية المغولية / الإلخانية",
    role: "قائد مغولي، مؤسس الدولة الإلخانية",
    shortBio:
      "حفيد جنكيز خان، قاد الحملة المغولية على بغداد عام 1258 التي انتهت بسقوط الخلافة العباسية في بغداد.",
    image: "/images/placeholder-person.svg",
    timeline: [
      {
        year: "حوالي 1217",
        title: "الولادة",
        description: "وُلد في بيئة مغولية ضمن العائلة الحاكمة.",
        type: "birth",
        sources: ["morgan-mongols"],
      },
      {
        year: 1256,
        title: "بداية الحملة الكبرى غربًا",
        description: "بدأ التحرك الكبير نحو إيران والعراق.",
        type: "event",
        sources: ["morgan-mongols", "rasheeduddin"],
      },
      {
        year: 1258,
        title: "سقوط بغداد",
        description: "دخول بغداد وسقوط الخلافة العباسية هناك.",
        type: "battle",
        sources: ["britannica-baghdad-1258", "morgan-mongols", "ibn-alathir"],
      },
      {
        year: 1265,
        title: "الوفاة",
        description: "توفي في إيران.",
        type: "death",
        sources: ["morgan-mongols"],
      },
    ],
    achievements: [
      "تأسيس الدولة الإلخانية في إيران",
      "قيادة الحملة التي أنهت الخلافة العباسية في بغداد",
    ],
    battles: ["baghdad-1258"],
    sources: ["morgan-mongols", "rasheeduddin", "britannica-baghdad-1258"],
  },
  {
    id: "al-mutasim",
    name: "المستعصم بالله",
    nameEn: "Al-Musta'sim",
    slug: "al-mustasim",
    categories: ["ملوك"],
    birthYear: 1213,
    deathYear: 1258,
    birthPlace: "بغداد",
    deathPlace: "بغداد",
    civilization: "الخلافة العباسية",
    role: "آخر الخلفاء العباسيين في بغداد",
    shortBio:
      "الخليفة العباسي الأخير في بغداد، حكم خلال فترة ضعف الخلافة وانتهى حكمه بسقوط المدينة على يد المغول عام 1258.",
    image: "/images/placeholder-person.svg",
    timeline: [
      {
        year: 1242,
        title: "تولي الخلافة",
        description: "أصبح خليفة بعد وفاة والده.",
        type: "event",
        sources: ["ibn-alathir", "britannica-baghdad-1258"],
      },
      {
        year: 1258,
        title: "سقوط بغداد والوفاة",
        description: "سقطت بغداد وقُتل الخليفة مع أفراد من عائلته وفق الروايات.",
        type: "death",
        sources: ["ibn-alathir", "rasheeduddin", "britannica-baghdad-1258"],
        uncertain: true,
      },
    ],
    achievements: [],
    sources: ["ibn-alathir", "britannica-baghdad-1258", "rasheeduddin"],
  },
];

export function getPersonBySlug(slug: string): Person | undefined {
  return persons.find((p) => p.slug === slug);
}

export function getPersonById(id: string): Person | undefined {
  return persons.find((p) => p.id === id);
}

export function getPersonsByCategory(category: string): Person[] {
  return persons.filter((p) => p.categories.includes(category as any));
}
