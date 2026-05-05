"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { format } from "date-fns";
import {
  CheckCircle2, Clock, Loader2, Smartphone, Star, ArrowLeft,
  Copy, Phone as PhoneIcon, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, nightsBetween } from "@/lib/utils";
import type { Property } from "@prisma/client";

type Stage =
  | "form"
  | "sending"
  | "method"
  | "stk_sending"
  | "stk_waiting"
  | "manual_pay"
  | "manual_submitting"
  | "success_paid"
  | "success_awaiting"
  | "failed";

type PaybillConfig = {
  paybillNumber: string;
  accountNumber: string;
  bankName: string;
  accountHolder: string;
};

export function BookingForm({
  property,
  initial,
  paybill,
  stkEnabled,
}: {
  property: Property;
  initial: { checkIn: string; checkOut: string; guests: number };
  paybill: PaybillConfig;
  stkEnabled: boolean;
}) {
  const t = useTranslations("booking");
  const tp = useTranslations("property");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const images: string[] = JSON.parse(property.images);
  const checkIn = initial.checkIn ? new Date(initial.checkIn) : null;
  const checkOut = initial.checkOut ? new Date(initial.checkOut) : null;
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const subtotalKes = nights * property.basePriceKes;
  const totalKes = subtotalKes + (nights > 0 ? property.cleaningFeeKes : 0);

  // Step 1: create booking, then move to method choice
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || nights < 1) {
      toast.error(t("dateError") || "Please select valid dates");
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
      // If STK push is unavailable, skip the method screen and jump straight to manual
      setStage(stkEnabled ? "method" : "manual_pay");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Booking failed");
      toast.error(err.message ?? "Booking failed");
      setStage("form");
    }
  };

  // Step 2a: STK Push flow
  const startStkPush = async () => {
    if (!bookingId) return;
    setStage("stk_sending");
    try {
      const stkRes = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, phone }),
      });
      if (!stkRes.ok) {
        const e = await stkRes.json();
        throw new Error(e?.error?.errorMessage || e?.error?.message || "M-Pesa request failed");
      }
      setStage("stk_waiting");
      toast.success(t("checkPhone"));
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message ?? "STK Push failed");
      setStage("failed");
    }
  };

  // Poll booking status while waiting for STK
  useEffect(() => {
    if (stage !== "stk_waiting" || !bookingId) return;
    let stopped = false;
    const poll = async () => {
      while (!stopped) {
        await new Promise((r) => setTimeout(r, 3000));
        const r = await fetch(`/api/bookings/${bookingId}/status`);
        if (!r.ok) continue;
        const data = await r.json();
        if (data.paymentStatus === "paid") { setStage("success_paid"); break; }
        if (data.paymentStatus === "failed") { setStage("failed"); break; }
      }
    };
    poll();
    return () => { stopped = true; };
  }, [stage, bookingId]);

  // Step 2b: Manual paybill — submit M-Pesa code
  const submitManualCode = async () => {
    if (!bookingId) return;
    const trimmed = mpesaCode.trim().toUpperCase();
    if (trimmed.length < 8) {
      toast.error(t("codeTooShort") || "M-Pesa code seems too short");
      return;
    }
    setStage("manual_submitting");
    try {
      const res = await fetch(`/api/bookings/${bookingId}/manual-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mpesaCode: trimmed }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || e?.error || "Code submission failed");
      }
      setStage("success_awaiting");
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message ?? "Submission failed");
      setStage("manual_pay");
    }
  };

  if (stage === "success_paid") return <SuccessScreen property={property} title={t("success")} body={t("successDesc")} />;
  if (stage === "success_awaiting") return <AwaitingScreen property={property} mpesaCode={mpesaCode.toUpperCase()} />;

  return (
    <div className="container-x py-12 grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-3 mb-6">
          <ArrowLeft size={14} /> Back
        </Button>
        <h1 className="font-display text-4xl text-[var(--color-deep-900)] mb-2">{t("title")}</h1>
        <p className="text-[var(--color-deep-700)] mb-8">
          {stage === "form" || stage === "sending" ? t("payHelp") : t("payHelpAfter") || "Choose how you'd like to pay."}
        </p>

        {/* STAGE: form */}
        {(stage === "form" || stage === "sending") && (
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
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712 345 678" required disabled={stage !== "form"} className="pl-10" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-deep-700)] mb-1.5 block">{t("specialRequests")}</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={stage !== "form"} />
            </div>

            <Button type="submit" variant="coral" size="lg" className="w-full" disabled={stage !== "form"}>
              {stage === "sending" ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
              {t("continueToPayment") || `Continue · ${formatPrice(totalKes, "KES", locale)}`}
            </Button>
            <p className="text-center text-xs text-[var(--color-deep-700)]">{tp("noChargeYet")}</p>
          </form>
        )}

        {/* STAGE: choose method */}
        {stage === "method" && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-deep-700)]">{t("chooseMethod") || "How would you like to pay?"}</p>
            <button
              onClick={startStkPush}
              className="w-full bg-white rounded-3xl p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-0.5 transition-all text-left flex items-start gap-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#00A859] grid place-items-center text-white font-bold shrink-0">M</div>
              <div className="flex-1">
                <p className="font-display text-lg text-[var(--color-deep-900)]">{t("methodStkTitle") || "Pay with STK Push"}</p>
                <p className="text-sm text-[var(--color-deep-700)] mt-0.5">{t("methodStkBody") || "Instant — get a PIN prompt on your phone, type your M-Pesa PIN, done."}</p>
                <Badge tone="ocean" className="mt-2">{t("methodStkBadge") || "Recommended"}</Badge>
              </div>
              <ChevronRight size={20} className="mt-3 text-[var(--color-deep-700)]" />
            </button>

            <button
              onClick={() => setStage("manual_pay")}
              className="w-full bg-white rounded-3xl p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-0.5 transition-all text-left flex items-start gap-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-[var(--color-ocean-100)] grid place-items-center text-[var(--color-ocean-700)] shrink-0">
                <PhoneIcon size={20} />
              </div>
              <div className="flex-1">
                <p className="font-display text-lg text-[var(--color-deep-900)]">{t("methodManualTitle") || "Pay manually via Pay Bill"}</p>
                <p className="text-sm text-[var(--color-deep-700)] mt-0.5">{t("methodManualBody") || "Open M-Pesa yourself, pay to the paybill, then paste the M-Pesa code here."}</p>
              </div>
              <ChevronRight size={20} className="mt-3 text-[var(--color-deep-700)]" />
            </button>
          </div>
        )}

        {/* STAGE: STK push in progress */}
        {(stage === "stk_sending" || stage === "stk_waiting") && (
          <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-soft)] text-center">
            <div className="h-16 w-16 rounded-full bg-[var(--color-ocean-100)] grid place-items-center mx-auto mb-4">
              <Loader2 size={28} className="animate-spin text-[var(--color-ocean-700)]" />
            </div>
            <h3 className="font-display text-2xl text-[var(--color-deep-900)] mb-2">{t("checkPhone")}</h3>
            <p className="text-sm text-[var(--color-deep-700)] max-w-sm mx-auto">{t("processing")}</p>
          </div>
        )}

        {/* STAGE: manual paybill instructions + code input */}
        {(stage === "manual_pay" || stage === "manual_submitting") && (
          <ManualPaybillScreen
            paybill={paybill}
            totalKes={totalKes}
            locale={locale}
            mpesaCode={mpesaCode}
            setMpesaCode={setMpesaCode}
            onSubmit={submitManualCode}
            submitting={stage === "manual_submitting"}
            errorMsg={errorMsg}
            onBackToMethods={stkEnabled ? () => setStage("method") : undefined}
            t={t}
          />
        )}

        {/* STAGE: failed */}
        {stage === "failed" && (
          <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-soft)]">
            <h3 className="font-display text-2xl text-[var(--color-coral-700)] mb-2">{t("failed")}</h3>
            {errorMsg && <p className="text-sm text-[var(--color-deep-700)] mb-4">{errorMsg}</p>}
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => setStage(stkEnabled ? "method" : "manual_pay")}>{t("tryAgain")}</Button>
              <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      {/* Summary sidebar (always visible) */}
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-28 bg-white rounded-[2rem] p-6 shadow-[var(--shadow-deep)] border border-[var(--color-sand-200)]">
          <div className="flex gap-4">
            <div className="relative h-20 w-28 shrink-0 rounded-2xl overflow-hidden">
              <Image src={images[0]} alt={property.name} fill className="object-cover" sizes="120px" />
            </div>
            <div>
              <Badge tone="ocean" className="mb-1">{property.location.split(",")[0]}</Badge>
              <h3 className="font-display text-lg leading-tight text-[var(--color-deep-900)]">{property.name}</h3>
              {property.reviewCount > 0 && (
                <p className="text-xs text-[var(--color-deep-700)] mt-0.5 flex items-center gap-1">
                  <Star size={10} className="fill-[var(--color-coral-500)] text-[var(--color-coral-500)]" />
                  {property.rating.toFixed(2)} · {property.reviewCount}
                </p>
              )}
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
              <span className="price">{formatPrice(totalKes, "KES", locale)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ManualPaybillScreen({
  paybill, totalKes, locale, mpesaCode, setMpesaCode, onSubmit, submitting, errorMsg, onBackToMethods, t,
}: {
  paybill: PaybillConfig;
  totalKes: number;
  locale: string;
  mpesaCode: string;
  setMpesaCode: (s: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  errorMsg: string | null;
  onBackToMethods?: () => void;
  t: ReturnType<typeof useTranslations<"booking">>;
}) {
  const copy = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    toast.success(`${label} copied`);
  };

  const totalFormatted = formatPrice(totalKes, "KES", locale);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-soft)] space-y-6">
      {onBackToMethods && (
        <button onClick={onBackToMethods} className="text-xs text-[var(--color-deep-700)] hover:underline flex items-center gap-1">
          <ArrowLeft size={12} /> {t("backToMethods") || "Back to payment methods"}
        </button>
      )}

      <div>
        <h2 className="font-display text-2xl text-[var(--color-deep-900)]">{t("manualPaybillTitle") || "Pay via M-Pesa Pay Bill"}</h2>
        <p className="text-sm text-[var(--color-deep-700)] mt-1">
          {t("manualPaybillIntro") || "On your M-Pesa, choose Lipa na M-Pesa → Pay Bill, then enter:"}
        </p>
      </div>

      {/* Instruction card */}
      <div className="rounded-2xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] p-5 space-y-3">
        <PaybillRow label="Pay bill (Business no.)" value={paybill.paybillNumber} onCopy={() => copy(paybill.paybillNumber, "Pay bill")} />
        <PaybillRow label="Account number" value={paybill.accountNumber} onCopy={() => copy(paybill.accountNumber, "Account")} hint={`${paybill.bankName} · ${paybill.accountHolder}`} />
        <PaybillRow label="Amount" value={totalFormatted} onCopy={() => copy(String(totalKes), "Amount")} hint={t("amountHint") || "Enter exact amount"} />
      </div>

      {/* Step list */}
      <ol className="space-y-2 text-sm text-[var(--color-deep-700)] list-decimal pl-5">
        <li>{t("step1") || "Open M-Pesa on your phone"}</li>
        <li>{t("step2") || "Choose Lipa na M-Pesa → Pay Bill"}</li>
        <li>{t("step3") || "Enter the Pay Bill, account number and exact amount above"}</li>
        <li>{t("step4") || "Enter your M-Pesa PIN and confirm"}</li>
        <li>{t("step5") || "You'll get an SMS — copy the M-Pesa code (e.g. RKL12ABCD3) and paste below"}</li>
      </ol>

      {/* Code input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--color-deep-700)]">
          {t("mpesaCodeLabel") || "M-Pesa transaction code (from SMS)"}
        </label>
        <Input
          value={mpesaCode}
          onChange={(e) => setMpesaCode(e.target.value.toUpperCase().replace(/\s/g, ""))}
          placeholder="RKL12ABCD3"
          className="uppercase tracking-wider font-mono"
          disabled={submitting}
        />
        {errorMsg && <p className="text-xs text-[var(--color-coral-700)]">{errorMsg}</p>}
      </div>

      <Button
        onClick={onSubmit}
        variant="coral"
        size="lg"
        className="w-full"
        disabled={submitting || mpesaCode.trim().length < 8}
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
        {t("confirmPayment") || `I've paid ${totalFormatted}`}
      </Button>

      <p className="text-xs text-center text-[var(--color-deep-700)]">
        {t("manualNote") || "Felister will verify your payment within a few hours and send confirmation by email."}
      </p>
    </div>
  );
}

function PaybillRow({ label, value, onCopy, hint }: { label: string; value: string; onCopy: () => void; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[var(--color-deep-700)] font-semibold">{label}</p>
        <p className="font-display text-2xl text-[var(--color-deep-900)] price">{value}</p>
        {hint && <p className="text-[11px] text-[var(--color-deep-700)] mt-0.5">{hint}</p>}
      </div>
      <button
        onClick={onCopy}
        className="shrink-0 h-10 w-10 rounded-xl bg-white border border-[var(--color-sand-200)] grid place-items-center hover:bg-[var(--color-sand-100)]"
        aria-label="Copy"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}

function SuccessScreen({ property, title, body }: { property: Property; title: string; body: string }) {
  return (
    <div className="container-x py-32 max-w-2xl mx-auto text-center">
      <div className="h-20 w-20 rounded-full bg-[var(--color-ocean-100)] grid place-items-center mx-auto mb-6">
        <CheckCircle2 size={36} className="text-[var(--color-ocean-700)]" />
      </div>
      <h1 className="font-display text-4xl md:text-5xl text-[var(--color-deep-900)]">{title}</h1>
      <p className="font-display italic text-xl md:text-2xl text-[var(--color-coral-600)] mt-2 tracking-tight">— Karibu to {property.name}</p>
      <p className="mt-6 text-[var(--color-deep-700)] max-w-md mx-auto leading-relaxed">{body}</p>
    </div>
  );
}

function AwaitingScreen({ property, mpesaCode }: { property: Property; mpesaCode: string }) {
  const t = useTranslations("booking");
  return (
    <div className="container-x py-32 max-w-2xl mx-auto text-center">
      <div className="h-20 w-20 rounded-full bg-[var(--color-coral-100)] grid place-items-center mx-auto mb-6">
        <Clock size={36} className="text-[var(--color-coral-700)]" />
      </div>
      <h1 className="font-display text-4xl md:text-5xl text-[var(--color-deep-900)]">
        {t("awaitingTitle") || "Booking received!"}
      </h1>
      <p className="font-display italic text-xl md:text-2xl text-[var(--color-coral-600)] mt-2 tracking-tight">— Karibu to {property.name}</p>
      <p className="mt-6 text-[var(--color-deep-700)] max-w-md mx-auto leading-relaxed">
        {t("awaitingBody") || "We've recorded your M-Pesa code. Felister will verify your payment within a few hours and confirm by email."}
      </p>
      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-sand-100)] px-4 py-2 text-sm">
        <span className="text-[var(--color-deep-700)]">M-Pesa code:</span>
        <span className="font-mono font-semibold tracking-wider text-[var(--color-deep-900)]">{mpesaCode}</span>
      </div>
    </div>
  );
}
