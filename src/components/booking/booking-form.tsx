"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { format } from "date-fns";
import { CheckCircle2, Loader2, Smartphone, Star, Bed, Bath, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, nightsBetween } from "@/lib/utils";
import type { Property } from "@prisma/client";

type Stage = "form" | "sending" | "waiting" | "success" | "failed";

export function BookingForm({
  property,
  initial,
}: {
  property: Property;
  initial: { checkIn: string; checkOut: string; guests: number };
}) {
  const t = useTranslations("booking");
  const tp = useTranslations("property");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [bookingId, setBookingId] = useState<string | null>(null);

  const images: string[] = JSON.parse(property.images);
  const checkIn = initial.checkIn ? new Date(initial.checkIn) : null;
  const checkOut = initial.checkOut ? new Date(initial.checkOut) : null;
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const subtotalKes = nights * property.basePriceKes;
  const totalKes = subtotalKes + (nights > 0 ? property.cleaningFeeKes : 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || nights < 1) {
      toast.error("Please select valid dates");
      return;
    }
    setStage("sending");
    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          checkIn: initial.checkIn,
          checkOut: initial.checkOut,
          guests: initial.guests,
          notes,
        }),
      });
      if (!bookingRes.ok) {
        const e = await bookingRes.json();
        throw new Error(e?.error?.message || e?.error || "Failed to create booking");
      }
      const { booking } = await bookingRes.json();
      setBookingId(booking.id);

      const stkRes = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id, phone }),
      });
      if (!stkRes.ok) {
        const e = await stkRes.json();
        throw new Error(e?.error?.errorMessage || e?.error?.message || "M-Pesa request failed");
      }
      setStage("waiting");
      toast.success(t("checkPhone"));
    } catch (err: any) {
      toast.error(err.message ?? "Booking failed");
      setStage("failed");
    }
  };

  // Poll booking status while waiting
  useEffect(() => {
    if (stage !== "waiting" || !bookingId) return;
    let stopped = false;
    const poll = async () => {
      while (!stopped) {
        await new Promise((r) => setTimeout(r, 3000));
        const r = await fetch(`/api/bookings/${bookingId}/status`);
        if (!r.ok) continue;
        const data = await r.json();
        if (data.paymentStatus === "paid") { setStage("success"); break; }
        if (data.paymentStatus === "failed") { setStage("failed"); break; }
      }
    };
    poll();
    return () => { stopped = true; };
  }, [stage, bookingId]);

  if (stage === "success") {
    return <SuccessScreen property={property} />;
  }

  return (
    <div className="container-x py-12 grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-3 mb-6">
          <ArrowLeft size={14} /> Back
        </Button>
        <h1 className="font-display text-4xl text-[var(--color-deep-900)] mb-2">{t("title")}</h1>
        <p className="text-[var(--color-deep-700)] mb-8">{t("payHelp")}</p>

        <form onSubmit={submit} className="bg-white rounded-[2rem] p-8 shadow-[var(--shadow-soft)] space-y-5">
          <h2 className="font-display text-xl text-[var(--color-deep-900)]">{t("yourDetails")}</h2>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-deep-700)] mb-1.5 block">{t("fullName")}</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required disabled={stage !== "form"} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-deep-700)] mb-1.5 block">{t("email")}</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={stage !== "form"} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-deep-700)] mb-1.5 block">{t("phone")}</label>
            <div className="relative">
              <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-deep-700)]" />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712 345 678"
                required
                disabled={stage !== "form"}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-deep-700)] mb-1.5 block">{t("specialRequests")}</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={stage !== "form"} />
          </div>

          {stage === "waiting" && (
            <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-ocean-50)] border border-[var(--color-ocean-200)] p-4 text-sm text-[var(--color-ocean-800)]">
              <Loader2 size={18} className="animate-spin" />
              <div>
                <p className="font-semibold">{t("checkPhone")}</p>
                <p className="text-xs opacity-80">{t("processing")}</p>
              </div>
            </div>
          )}

          {stage === "failed" && (
            <div className="rounded-2xl bg-[var(--color-coral-50)] border border-[var(--color-coral-200)] p-4 text-sm text-[var(--color-coral-700)]">
              <p className="font-semibold">{t("failed")}</p>
              <button type="button" onClick={() => setStage("form")} className="underline mt-1 text-xs">{t("tryAgain")}</button>
            </div>
          )}

          <Button
            type="submit"
            variant="coral"
            size="lg"
            className="w-full"
            disabled={stage !== "form"}
          >
            {stage === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Smartphone size={16} />}
            {t("payNow", { amount: formatPrice(totalKes, "KES", locale) })}
          </Button>
          <p className="text-center text-xs text-[var(--color-deep-700)]">{tp("noChargeYet")}</p>
        </form>
      </div>

      {/* Summary */}
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-28 bg-white rounded-[2rem] p-6 shadow-[var(--shadow-deep)] border border-[var(--color-sand-200)]">
          <div className="flex gap-4">
            <div className="relative h-20 w-28 shrink-0 rounded-2xl overflow-hidden">
              <Image src={images[0]} alt={property.name} fill className="object-cover" sizes="120px" />
            </div>
            <div>
              <Badge tone="ocean" className="mb-1">{property.location.split(",")[0]}</Badge>
              <h3 className="font-display text-lg leading-tight text-[var(--color-deep-900)]">{property.name}</h3>
              <p className="text-xs text-[var(--color-deep-700)] mt-0.5 flex items-center gap-1">
                <Star size={10} className="fill-[var(--color-coral-500)] text-[var(--color-coral-500)]" />
                {property.rating.toFixed(2)} · {property.reviewCount}
              </p>
            </div>
          </div>

          <h4 className="font-display text-sm uppercase tracking-wider text-[var(--color-deep-700)] mt-6 mb-3">{t("summary")}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Check-in</span><span>{checkIn ? format(checkIn, "dd MMM yyyy") : "—"}</span></div>
            <div className="flex justify-between"><span>Check-out</span><span>{checkOut ? format(checkOut, "dd MMM yyyy") : "—"}</span></div>
            <div className="flex justify-between"><span>Guests</span><span>{initial.guests}</span></div>
            <div className="flex justify-between"><span>Property</span><span>{property.maxGuests} guests · {property.bedrooms}br</span></div>
          </div>

          <div className="mt-5 pt-5 border-t border-[var(--color-sand-200)] space-y-2 text-sm">
            <div className="flex justify-between text-[var(--color-deep-700)]">
              <span>{formatPrice(property.basePriceKes, "KES", locale)} × {nights} nights</span>
              <span>{formatPrice(subtotalKes, "KES", locale)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-deep-700)]">
              <span>{tp("cleaningFee")}</span>
              <span>{formatPrice(property.cleaningFeeKes, "KES", locale)}</span>
            </div>
            <div className="flex justify-between font-display text-xl pt-3 border-t border-[var(--color-sand-200)] text-[var(--color-deep-900)]">
              <span>Total</span>
              <span>{formatPrice(totalKes, "KES", locale)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[var(--color-sand-100)] p-4 flex items-start gap-3 text-xs text-[var(--color-deep-700)]">
            <div className="h-8 w-8 rounded-lg bg-[#00A859] grid place-items-center text-white font-bold shrink-0">M</div>
            <div>
              <p className="font-semibold text-[var(--color-deep-900)] mb-1">Pay with M-Pesa</p>
              <p>You'll receive an STK push on your phone — enter your M-Pesa PIN to confirm. We never store your PIN.</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SuccessScreen({ property }: { property: Property }) {
  const t = useTranslations("booking");
  return (
    <div className="container-x py-32 max-w-2xl mx-auto text-center">
      <div className="h-20 w-20 rounded-full bg-[var(--color-ocean-100)] grid place-items-center mx-auto mb-6">
        <CheckCircle2 size={36} className="text-[var(--color-ocean-700)]" />
      </div>
      <h1 className="font-display text-4xl md:text-5xl text-[var(--color-deep-900)]">{t("success")}</h1>
      <p className="font-display italic text-xl md:text-2xl text-[var(--color-coral-600)] mt-2 tracking-tight">— Karibu to {property.name}</p>
      <p className="mt-6 text-[var(--color-deep-700)] max-w-md mx-auto leading-relaxed">{t("successDesc")}</p>
    </div>
  );
}
