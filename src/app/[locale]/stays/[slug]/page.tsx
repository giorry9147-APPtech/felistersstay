import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { PropertyDetail } from "@/components/property/property-detail";

export async function generateStaticParams() {
  const properties = await db.property.findMany();
  return properties.map((p) => ({ slug: p.slug }));
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const property = await db.property.findUnique({
    where: { slug },
    include: {
      reviews: { orderBy: { createdAt: "desc" } },
      blockedDates: true,
      bookings: { where: { paymentStatus: { in: ["paid", "pending"] } } },
    },
  });
  if (!property) notFound();

  return <PropertyDetail property={property} />;
}
