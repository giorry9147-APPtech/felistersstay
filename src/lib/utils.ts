import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: "KES" | "USD" | "EUR" = "KES", locale = "en") {
  const localeMap: Record<string, string> = { en: "en-KE", nl: "nl-NL", sw: "sw-KE" };
  return new Intl.NumberFormat(localeMap[locale] ?? "en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const FX_RATES: Record<"KES" | "USD" | "EUR", number> = {
  KES: 1,
  USD: 1 / 129,
  EUR: 1 / 140,
};

export function convertFromKes(kes: number, to: "KES" | "USD" | "EUR") {
  return Math.round(kes * FX_RATES[to]);
}

export function nightsBetween(checkIn: Date, checkOut: Date) {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
