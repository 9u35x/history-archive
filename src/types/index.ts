export type Category =
  | "قادة"
  | "ملوك"
  | "رؤساء"
  | "علماء"
  | "فلاسفة"
  | "شعراء"
  | "شخصيات عسكرية"
  | "مستكشفون"
  | "شخصيات مؤثرة";

export interface Source {
  id: string;
  title: string;
  author?: string;
  year?: string | number;
  url?: string;
  type: "book" | "article" | "museum" | "archive" | "encyclopedia" | "primary";
  note?: string;
}

export interface TimelineEvent {
  year: number | string;
  title: string;
  description: string;
  type?: "birth" | "death" | "battle" | "event" | "achievement" | "other";
  sources?: string[]; // source ids
  uncertain?: boolean;
}

export interface Person {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  categories: Category[];
  birthYear?: number | string;
  deathYear?: number | string;
  birthPlace?: string;
  deathPlace?: string;
  civilization?: string;
  role: string;
  shortBio: string;
  image?: string; // path or url (public domain / placeholder)
  imageCredit?: string;
  timeline: TimelineEvent[];
  achievements: string[];
  battles?: string[]; // battle ids
  relatedPersons?: string[]; // person ids
  contemporaryStates?: string[];
  famousQuotes?: { text: string; source?: string; uncertain?: boolean }[];
  sources: string[]; // source ids
  last24Hours?: {
    time: string;
    event: string;
    uncertain?: boolean;
    note?: string;
  }[];
}

export interface Battle {
  id: string;
  name: string;
  slug: string;
  date: string;
  year: number;
  location: string;
  coordinates?: [number, number]; // lat, lng
  sides: { name: string; leaders?: string[]; result?: string }[];
  outcome: string;
  significance: string;
  description: string;
  sources: string[];
  relatedPersons?: string[];
}

export interface HistoricalEvent {
  id: string;
  title: string;
  slug: string;
  year: number;
  date?: string;
  location?: string;
  description: string;
  type: "war" | "political" | "cultural" | "scientific" | "religious" | "other";
  region: "arab" | "global" | "both";
  sources: string[];
  relatedPersons?: string[];
  relatedBattles?: string[];
  uncertain?: boolean;
}

export interface CountryEra {
  id: string;
  name: string;
  yearStart: number;
  yearEnd: number;
  capital?: string;
  ruler?: string;
  description?: string;
  approximateArea?: string;
  sources: string[];
  coordinates?: [number, number];
}

export interface NarrativeComparison {
  id: string;
  eventTitle: string;
  eventSlug: string;
  year: number;
  agreedFacts: string[];
  disputedPoints: {
    point: string;
    versions: { sourceLabel: string; claim: string; sourceId?: string }[];
  }[];
  sources: string[];
  note: string;
}
