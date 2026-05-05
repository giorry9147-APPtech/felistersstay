import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Heart, MapPin } from "lucide-react";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <article className="container-x py-16 md:py-24">
      <div className="grid gap-16 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[var(--shadow-deep)]">
            <Image src="/family3.jpeg" alt="Felister with her family" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-[var(--shadow-soft)] flex items-center gap-3">
            <Heart size={18} className="text-[var(--color-coral-500)] fill-current" />
            <div>
              <p className="font-display text-sm">200+ happy stays</p>
              <p className="text-xs text-[var(--color-deep-700)]">Hosting since 2022</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Badge tone="coral" className="mb-4"><MapPin size={10} /> Mombasa Beach, Kenya</Badge>
          <h1 className="font-display text-4xl md:text-6xl text-[var(--color-deep-900)] leading-[1.05]">{t("title")}</h1>
          <p className="font-display italic text-2xl md:text-3xl text-[var(--color-coral-600)] mt-3 tracking-tight">{t("subtitle")}</p>
          <p className="mt-6 text-lg text-[var(--color-deep-700)] leading-relaxed whitespace-pre-line">{t("body")}</p>

          <div className="mt-10">
            <Button asChild variant="coral" size="lg">
              <Link href="/stays">See the homes</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
