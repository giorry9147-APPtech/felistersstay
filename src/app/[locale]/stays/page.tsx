import { setRequestLocale, getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { StaysGrid } from "@/components/stays/stays-grid";
import { Badge } from "@/components/ui/badge";

export default async function StaysPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("properties");
  const properties = await db.property.findMany({ where: { active: true }, orderBy: { basePriceKes: "desc" } });

  return (
    <div className="container-x pt-12 md:pt-20 pb-24">
      <div className="max-w-3xl mb-12">
        <Badge tone="coral" className="mb-4">Our coastal collection</Badge>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-[var(--color-deep-900)]">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-[var(--color-deep-700)] leading-relaxed">{t("subtitle")}</p>
      </div>

      <StaysGrid properties={properties} />
    </div>
  );
}
