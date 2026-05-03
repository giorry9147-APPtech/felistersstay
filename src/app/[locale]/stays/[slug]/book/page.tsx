import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { BookingForm } from "@/components/booking/booking-form";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const property = await db.property.findUnique({ where: { slug } });
  if (!property) notFound();

  return (
    <BookingForm
      property={property}
      initial={{
        checkIn: sp.checkIn ?? "",
        checkOut: sp.checkOut ?? "",
        guests: Number(sp.guests ?? 2),
      }}
    />
  );
}
