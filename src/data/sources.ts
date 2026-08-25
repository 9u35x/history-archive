import { Source } from "@/types";

export const sources: Source[] = [
  {
    id: "ibn-alathir",
    title: "الكامل في التاريخ",
    author: "ابن الأثير",
    year: "القرن 13م",
    type: "primary",
    note: "مصدر أساسي لتاريخ المنطقة في العصور الوسطى",
  },
  {
    id: "ibn-khaldun",
    title: "المقدمة / العبر",
    author: "ابن خلدون",
    year: "القرن 14م",
    type: "primary",
  },
  {
    id: "britannica-saladin",
    title: "Saladin",
    author: "Encyclopædia Britannica",
    type: "encyclopedia",
    url: "https://www.britannica.com/biography/Saladin",
  },
  {
    id: "britannica-baghdad-1258",
    title: "Baghdad - Mongol invasion",
    author: "Encyclopædia Britannica",
    type: "encyclopedia",
    url: "https://www.britannica.com/place/Baghdad",
  },
  {
    id: "lyons-jackson",
    title: "Saladin: The Politics of the Holy War",
    author: "Malcolm Cameron Lyons & D.E.P. Jackson",
    year: 1982,
    type: "book",
  },
  {
    id: "morgan-mongols",
    title: "The Mongols",
    author: "David Morgan",
    year: 2007,
    type: "book",
  },
  {
    id: "rasheeduddin",
    title: "جامع التواريخ",
    author: "رشيد الدين فضل الله الهمذاني",
    year: "القرن 14م",
    type: "primary",
    note: "مصدر فارسي مهم عن المغول",
  },
  {
    id: "wiki-commons-note",
    title: "صور من ويكيميديا كومنز (ملكية عامة أو رخصة حرة)",
    type: "archive",
    note: "يُستخدم فقط الصور المرخصة للاستخدام الحر أو الملك العام",
  },
  {
    id: "unesco-baghdad",
    title: "وثائق ومواد متعلقة بتاريخ بغداد",
    type: "museum",
    note: "مراجع عامة من مؤسسات ثقافية",
  },
  {
    id: "cambridge-history",
    title: "The Cambridge History of Iran / Islamic World references",
    type: "encyclopedia",
    note: "مراجع أكاديمية عامة",
  },
];

export function getSourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

export function getSourcesByIds(ids: string[]): Source[] {
  return ids.map((id) => getSourceById(id)).filter(Boolean) as Source[];
}
