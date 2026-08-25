import { Battle } from "@/types";

export const battles: Battle[] = [
  {
    id: "hattin",
    name: "معركة حطين",
    slug: "hattin",
    date: "4 يوليو 1187م",
    year: 1187,
    location: "قرب طبريا / حطين (فلسطين التاريخية)",
    coordinates: [32.8, 35.45],
    sides: [
      {
        name: "القوات الأيوبية",
        leaders: ["صلاح الدين الأيوبي"],
        result: "انتصار",
      },
      {
        name: "مملكة القدس الصليبية وحلفائها",
        leaders: ["غي دي لوزينيان", "ريمون الثالث"],
        result: "هزيمة",
      },
    ],
    outcome: "انتصار أيوبي حاسم أدى إلى استعادة معظم مدن الساحل والقدس لاحقًا في العام نفسه.",
    significance:
      "من أهم المعارك في تاريخ الحروب الصليبية؛ أدت مباشرة إلى سقوط مملكة القدس تقريبًا واستعادة المسلمين للقدس.",
    description:
      "دارت المعركة في ظروف حر شديد ونقص في المياه للقوات الصليبية. حقق صلاح الدين نصرًا استراتيجيًا كبيرًا. التفاصيل التكتيكية الدقيقة تختلف في بعض التفاصيل بين المصادر الإسلامية واللاتينية.",
    sources: ["britannica-saladin", "lyons-jackson", "ibn-alathir"],
    relatedPersons: ["saladin"],
  },
  {
    id: "baghdad-1258",
    name: "سقوط بغداد 1258",
    slug: "baghdad-1258",
    date: "فبراير 1258م",
    year: 1258,
    location: "بغداد",
    coordinates: [33.3152, 44.3661],
    sides: [
      {
        name: "الجيش المغولي",
        leaders: ["هولاكو خان"],
        result: "انتصار",
      },
      {
        name: "الخلافة العباسية",
        leaders: ["المستعصم بالله"],
        result: "هزيمة وسقوط المدينة",
      },
    ],
    outcome: "سقوط بغداد ونهاية الخلافة العباسية في المدينة. قُتل الخليفة وفق معظم الروايات.",
    significance:
      "حدث مفصلي في التاريخ الإسلامي؛ يُعتبر نهاية العصر الذهبي للعباسيين في بغداد وبداية فترة سيطرة مغولية/إلخانية على العراق وإيران.",
    description:
      "حاصر المغول بغداد ثم دخلوها. الروايات تختلف في حجم الدمار وعدد القتلى وطريقة مقتل الخليفة. المصادر المغولية والإسلامية تقدم صورًا متباينة أحيانًا.",
    sources: ["britannica-baghdad-1258", "morgan-mongols", "ibn-alathir", "rasheeduddin"],
    relatedPersons: ["hulagu", "al-mustasim"],
  },
];

export function getBattleBySlug(slug: string): Battle | undefined {
  return battles.find((b) => b.slug === slug);
}

export function getBattleById(id: string): Battle | undefined {
  return battles.find((b) => b.id === id);
}
