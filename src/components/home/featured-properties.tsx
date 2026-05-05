"use client";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Bed, Bath, Users, Star, MapPin } from "lucide-react";
import type { Property } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

export function FeaturedProperties({ properties }: { properties: Property[] }) {
  const t = useTranslations("properties");
  const locale = useLocale();

  return (
    <section className="container-x pt-24 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <Badge tone="coral" className="mb-4">More stays</Badge>
          <h2 className="font-display text-3xl md:text-5xl text-[var(--color-deep-900)] leading-[1.05]">
            Apartments &amp; retreats
          </h2>
          <p className="mt-4 text-[var(--color-deep-700)] text-lg leading-relaxed">
            Smaller stays in Felister's collection — perfect for couples, solo travellers and quieter getaways.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/stays">View all <ArrowUpRight size={16} /></Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {properties.map((p, i) => {
          const images: string[] = JSON.parse(p.images);
          const isLarge = i === 0;
          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={isLarge ? "lg:col-span-7" : "lg:col-span-5"}
            >
              <Link href={`/stays/${p.slug}`} className="group block">
                <div className={`relative overflow-hidden rounded-[var(--radius-card)] ${isLarge ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
                  <Image
                    src={images[0]}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <Badge tone="white">
                      <MapPin size={10} /> {p.location.split(",")[0]}
                    </Badge>
                    {p.type === "villa" && <Badge tone="coral">Villa</Badge>}
                  </div>

                  <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1">
                    {p.reviewCount > 0 ? (
                      <>
                        <Star size={12} className="fill-[var(--color-coral-500)] text-[var(--color-coral-500)]" />
                        {p.rating.toFixed(2)} · {p.reviewCount}
                      </>
                    ) : (
                      <span className="text-[var(--color-coral-700)]">New listing</span>
                    )}
                  </div>

                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                    <div className="text-white">
                      <h3 className={`font-display ${isLarge ? "text-3xl md:text-4xl" : "text-2xl"} leading-tight`}>{p.name}</h3>
                      <div className="mt-2 flex items-center gap-3 text-sm text-white/85">
                        <span className="flex items-center gap-1"><Users size={14} /> {p.maxGuests}</span>
                        <span className="flex items-center gap-1"><Bed size={14} /> {p.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath size={14} /> {p.bathrooms}</span>
                      </div>
                    </div>
                    <div className="glass rounded-2xl px-4 py-2 text-right">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-deep-700)]">{t("from")}</p>
                      <p className="font-display text-lg text-[var(--color-deep-900)] leading-tight">
                        {formatPrice(p.basePriceKes, "KES", locale)}
                      </p>
                      <p className="text-[10px] text-[var(--color-deep-700)]">{t("perNight")}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-start justify-between gap-4">
                  <p className="text-[var(--color-deep-700)] leading-relaxed text-sm md:text-base flex-1">
                    {p.shortDescription}
                  </p>
                  <span className="shrink-0 mt-1 h-10 w-10 rounded-full bg-[var(--color-deep-900)] text-white grid place-items-center transition-transform group-hover:rotate-45">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
