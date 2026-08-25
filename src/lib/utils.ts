import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(year: number | string | undefined): string {
  if (year === undefined || year === null) return "غير معروف";
  if (typeof year === "string") return year;
  if (year < 0) return `${Math.abs(year)} ق.م`;
  return `${year} م`;
}
