"use client";
import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { DayPicker, type DateRange } from "react-day-picker";
import { addDays, eachDayOfInterval, format, isBefore, isWithinInterval, startOfDay } from "date-fns";
import { Star, Users, Minus, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, nightsBetween, convertFromKes } from "@/lib/utils";
import { CurrencyToggle } from "@/components/site/currency-toggle";
import type { Property, BlockedDate, Booking } from "@prisma/client";
import "react-day-picker/style.css";

type Props = {
  property: Property & { blockedDates: BlockedDate[]; bookings: Booking[] };
};

export function BookingWidget({ property }: Props) {
  const t = useTranslations("property");
  const locale = useLocale();
  const router = useRouter();
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [currency, setCurrency] = useState<"KES" | "USD" | "EUR">("KES");

  const disabled = useMemo(() => {
    const all: Date[] = [];
    for (const b of property.blockedDates) {
      all.push(...eachDayOfInterval({ start: new Date(b.startDate), end: addDays(new Date(b.endDate), -1) }));
    }
    for (const b of property.bookings) {
      all.push(...eachDayOfInterval({ start: new Date(b.checkIn), end: addDays(new Date(b.checkOut), -1) }));
    }
    return all;
  }, [property.blockedDates, property.bookings]);

  const nights = range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;
  const subtotalKes = nights * property.basePriceKes;
  const totalKes = subtotalKes + (nights > 0 ? property.cleaningFeeKes : 0);

  const fmt = (kes: number) => {
    const v = currency === "KES" ? kes : convertFromKes(kes, currency);
    return formatPrice(v, currency, locale);
  };

  const onReserve = () => {
    if (!range?.from || !range?.to || nights < 1) return;
    const params = new URLSearchParams({
      checkIn: range.from.toISOString().slice(0, 10),
      checkOut: range.to.toISOString().slice(0, 10),
      guests: String(guests),
    });
    router.push(`/stays/${property.slug}/book?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[var(--shadow-deep)] border border-[var(--color-sand-200)]">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="font-display text-3xl text-[var(--color-deep-900)]">
            {fmt(property.basePriceKes)}
          </span>
          <span className="text-sm text-[var(--color-deep-700)] ml-1.5">/ night</span>
        </div>
        <CurrencyToggle value={currency} onChange={setCurrency} />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-[var(--color-deep-700)] mb-4">
        <Star size={12} className="fill-[var(--color-coral-500)] text-[var(--color-coral-500)]" />
        <span className="font-semibold">{property.rating.toFixed(2)}</span>
        <span>· {property.reviewCount} reviews</span>
      </div>

      <div className="rounded-2xl border border-[var(--color-sand-200)] overflow-hidden">
        <div className="grid grid-cols-2 border-b border-[var(--color-sand-200)]">
          <DateBox label="Check-in" value={range?.from ? format(range.from, "dd MMM yyyy") : t("selectDates")} />
          <DateBox label="Check-out" value={range?.to ? format(range.to, "dd MMM yyyy") : t("selectDates")} className="border-l border-[var(--color-sand-200)]" />
        </div>
        <div className="p-2 max-h-[360px] overflow-auto">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={[{ before: startOfDay(new Date()) }, ...disabled]}
            numberOfMonths={1}
            className="rdp-felister"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl border border-[var(--color-sand-200)] p-4">
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span className="text-sm">Guests</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            disabled={guests <= 1}
            className="h-8 w-8 rounded-full border border-[var(--color-sand-200)] grid place-items-center disabled:opacity-50"
          ><Minus size={14} /></button>
          <span className="w-6 text-center font-semibold">{guests}</span>
          <button
            onClick={() => setGuests((g) => Math.min(property.maxGuests, g + 1))}
            disabled={guests >= property.maxGuests}
            className="h-8 w-8 rounded-full border border-[var(--color-sand-200)] grid place-items-center disabled:opacity-50"
          ><Plus size={14} /></button>
        </div>
      </div>

      <Button onClick={onReserve} disabled={nights < 1} variant="coral" size="lg" className="w-full mt-4">
        {nights < 1 ? t("checkAvailability") : t("reserve")}
      </Button>
      <p className="text-center text-xs text-[var(--color-deep-700)] mt-2">{t("noChargeYet")}</p>

      {nights > 0 && (
        <div className="mt-5 pt-5 border-t border-[var(--color-sand-200)] space-y-2 text-sm">
          <Row label={`${fmt(property.basePriceKes)} × ${nights} ${t("nightsCount", { n: nights })}`} value={fmt(subtotalKes)} />
          <Row label={t("cleaningFee")} value={fmt(property.cleaningFeeKes)} />
          <div className="pt-2 border-t border-[var(--color-sand-200)] flex justify-between font-display text-lg">
            <span>{t("youPay")}</span>
            <span>{fmt(totalKes)}</span>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--color-deep-700)]">
        <ShieldCheck size={14} /> Secure M-Pesa & card payments
      </div>

      <style jsx global>{`
        .rdp-felister { --rdp-accent-color: var(--color-ocean-600); --rdp-accent-background-color: var(--color-ocean-100); font-size: 13px; }
        .rdp-felister .rdp-day_button { border-radius: 9999px; }
        .rdp-felister .rdp-day_selected, .rdp-felister .rdp-day_range_start, .rdp-felister .rdp-day_range_end {
          background: var(--color-ocean-600); color: white;
        }
        .rdp-felister .rdp-day_range_middle { background: var(--color-ocean-100); color: var(--color-ocean-900); }
      `}</style>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[var(--color-deep-700)]">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function DateBox({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`p-3 ${className ?? ""}`}>
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-deep-700)] font-semibold">{label}</p>
      <p className="text-sm text-[var(--color-deep-900)] mt-0.5">{value}</p>
    </div>
  );
}
