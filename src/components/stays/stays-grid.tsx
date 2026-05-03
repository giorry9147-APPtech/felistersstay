"use client";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Bed, Bath, Users, Star, MapPin, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

export function StaysGrid({ properties }: { properties: Property[] }) {
  const t = useTranslations("properties");
  const locale = useLocale();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((p, i) => {
        const images: string[] = JSON.parse(p.images);
        return (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link href={`/stays/${p.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)]">
                <Image src={images[0]} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                  <Badge tone="white"><MapPin size={10} /> {p.location.split(",")[0]}</Badge>
                  {p.type === "villa" && <Badge tone="coral">Villa</Badge>}
                </div>
                <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1">
                  {p.reviewCount > 0 ? (
                    <>
                      <Star size={12} className="fill-[var(--color-coral-500)] text-[var(--color-coral-500)]" /> {p.rating.toFixed(2)}
                    </>
                  ) : (
                    <span className="text-[var(--color-coral-700)]">New listing</span>
                  )}
                </div>
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <h3 className="font-display text-2xl leading-tight">{p.name}</h3>
                  <p className="text-sm text-white/85 mt-1 line-clamp-2">{p.shortDescription}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-[var(--color-deep-700)]">
                  <span className="flex items-center gap-1"><Users size={14} /> {p.maxGuests}</span>
                  <span className="flex items-center gap-1"><Bed size={14} /> {p.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath size={14} /> {p.bathrooms}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--color-deep-700)]">{t("from")} </span>
                  <span className="font-display text-lg text-[var(--color-deep-900)]">{formatPrice(p.basePriceKes, "KES", locale)}</span>
                  <span className="text-xs text-[var(--color-deep-700)]">{t("perNight")}</span>
                </div>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
