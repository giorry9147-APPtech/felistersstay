import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { ExperienceStrip } from "@/components/home/experience-strip";
import { AboutFelister } from "@/components/home/about-felister";
import { Testimonials } from "@/components/home/testimonials";
import { WhyDirect } from "@/components/home/why-direct";
import { CtaBanner } from "@/components/home/cta-banner";
import { db } from "@/lib/db";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const properties = await db.property.findMany({ where: { active: true }, orderBy: { basePriceKes: "desc" } });
  const reviews = await db.review.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { property: { select: { name: true, slug: true, images: true } } },
  });

  return (
    <>
      <Hero />
      <FeaturedProperties properties={properties} />
      <ExperienceStrip />
      <WhyDirect />
      <AboutFelister />
      <Testimonials reviews={reviews} />
      <CtaBanner />
    </>
  );
}
