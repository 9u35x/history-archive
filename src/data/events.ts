import { HistoricalEvent, NarrativeComparison } from "@/types";

export const events: HistoricalEvent[] = [
  {
    id: "fall-baghdad-1258",
    title: "سقوط بغداد",
    slug: "fall-of-baghdad-1258",
    year: 1258,
    date: "فبراير 1258",
    location: "بغداد",
    description:
      "دخول القوات المغولية بقيادة هولاكو إلى بغداد ونهاية حكم الخلافة العباسية في المدينة.",
    type: "war",
    region: "both",
    sources: ["britannica-baghdad-1258", "morgan-mongols", "ibn-alathir", "rasheeduddin"],
    relatedPersons: ["hulagu", "al-mustasim"],
    relatedBattles: ["baghdad-1258"],
  },
  {
    id: "battle-hattin",
    title: "معركة حطين",
    slug: "battle-of-hattin",
    year: 1187,
    location: "حطين",
    description: "انتصار صلاح الدين على القوات الصليبية.",
    type: "war",
    region: "arab",
    sources: ["britannica-saladin", "lyons-jackson"],
    relatedPersons: ["saladin"],
    relatedBattles: ["hattin"],
  },
  {
    id: "recapture-jerusalem-1187",
    title: "استعادة القدس",
    slug: "recapture-jerusalem-1187",
    year: 1187,
    date: "أكتوبر 1187",
    location: "القدس",
    description: "دخول صلاح الدين إلى القدس بعد حطين.",
    type: "political",
    region: "arab",
    sources: ["britannica-saladin", "lyons-jackson"],
    relatedPersons: ["saladin"],
  },
];

export const narrativeComparisons: NarrativeComparison[] = [
  {
    id: "baghdad-1258-narratives",
    eventTitle: "سقوط بغداد 1258",
    eventSlug: "fall-of-baghdad-1258",
    year: 1258,
    agreedFacts: [
      "دخلت القوات المغولية بقيادة هولاكو بغداد في فبراير 1258.",
      "انتهت الخلافة العباسية في بغداد بهذا الحدث.",
      "قُتل الخليفة المستعصم بالله وفق معظم المصادر.",
      "وقع دمار واسع في المدينة.",
    ],
    disputedPoints: [
      {
        point: "حجم الخسائر البشرية",
        versions: [
          {
            sourceLabel: "مصادر إسلامية متأخرة",
            claim: "أرقام مرتفعة جدًا (مئات الآلاف) تُذكر في بعض الروايات.",
            sourceId: "ibn-alathir",
          },
          {
            sourceLabel: "مصادر حديثة أكاديمية",
            claim: "الأرقام الدقيقة غير مؤكدة ويُرجح المبالغة في بعض الروايات التقليدية.",
            sourceId: "morgan-mongols",
          },
        ],
      },
      {
        point: "طريقة مقتل الخليفة",
        versions: [
          {
            sourceLabel: "روايات متعددة",
            claim: "تختلف بين الدوس بالخيول أو طرق أخرى؛ التفاصيل غير متفق عليها بالكامل.",
          },
        ],
      },
      {
        point: "مدى تدمير المكتبات والمؤسسات",
        versions: [
          {
            sourceLabel: "روايات تقليدية",
            claim: "تُذكر قصة رمي الكتب في دجلة وتغير لون الماء.",
          },
          {
            sourceLabel: "نقد حديث",
            claim: "بعض التفاصيل قد تكون مبالغًا فيها أو رمزية؛ الدمار حدث لكن الحجم الدقيق محل نقاش.",
          },
        ],
      },
    ],
    sources: ["ibn-alathir", "rasheeduddin", "morgan-mongols", "britannica-baghdad-1258"],
    note: "هذا القسم يعرض نقاط الاتفاق والاختلاف دون ترجيح رواية واحدة كحقيقة مطلقة. يُنصح بالرجوع إلى المصادر الأصلية والدراسات الأكاديمية.",
  },
];

export function getEventBySlug(slug: string): HistoricalEvent | undefined {
  return events.find((e) => e.slug === slug);
}

export function getEventsByYear(year: number): HistoricalEvent[] {
  return events.filter((e) => e.year === year);
}

export function getNarrativeBySlug(slug: string): NarrativeComparison | undefined {
  return narrativeComparisons.find((n) => n.eventSlug === slug);
}
