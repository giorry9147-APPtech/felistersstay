"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Star, Bed, Bath, Users, MapPin, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@prisma/client";

export function FeaturedVilla({ villa }: { villa: Property }) {
  const t = useTranslations("properties");
  const locale = useLocale();
  const images: string[] = JSON.parse(villa.images);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: false });
  const [selectedIdx, setSelectedIdx] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIdx(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi]);

  // Autoplay every 5s
  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <section className="container-x mt-8 md:mt-16 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white rounded-[2rem] shadow-[var(--shadow-deep)] overflow-hidden border border-[var(--color-sand-200)]"
      >
        {/* Featured ribbon */}
        <div className="absolute top-5 left-5 z-10">
          <Badge tone="coral" className="!bg-[var(--color-coral-500)] !text-white !ring-0 shadow-[var(--shadow-warm)]">
            <Sparkles size={12} /> Felister's flagship
          </Badge>
        </div>

        <div className="grid lg:grid-cols-12">
          {/* Photo carousel — first on mobile, left on desktop */}
          <div className="lg:col-span-7 relative">
            <div className="overflow-hidden h-72 sm:h-96 lg:h-[640px]" ref={emblaRef}>
              <div className="flex h-full">
                {images.map((src, i) => (
                  <div key={src} className="relative shrink-0 grow-0 basis-full h-full">
                    <Image
                      src={src}
                      alt={`${villa.name} photo ${i + 1}`}
                      fill
                      className="object-cover"
                      priority={i === 0}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel controls */}
            <button
              onClick={scrollPrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 hover:bg-white grid place-items-center shadow-[var(--shadow-soft)] transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 hover:bg-white grid place-items-center shadow-[var(--shadow-soft)] transition"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === selectedIdx ? "w-6 bg-white" : "w-1.5 bg-white/55 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-5 p-6 md:p-10 flex flex-col">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge tone="ocean">
                <MapPin size={10} /> {villa.location.split(",")[0]}
              </Badge>
              <Badge tone="sand">
                <Star size={10} className="fill-current" /> {villa.rating.toFixed(1)} · {villa.reviewCount} reviews
              </Badge>
            </div>

            <h2 className="font-display text-3xl md:text-5xl text-[var(--color-deep-900)] leading-[1.05] mb-4">
              {villa.name}
            </h2>

            <p className="text-[var(--color-deep-700)] leading-relaxed text-base md:text-lg mb-6">
              {villa.shortDescription}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6 pt-5 border-t border-[var(--color-sand-200)]">
              <Stat icon={<Users size={16} />} value={villa.maxGuests} label="guests" />
              <Stat icon={<Bed size={16} />} value={villa.bedrooms} label="bedrooms" />
              <Stat icon={<Bath size={16} />} value={villa.bathrooms} label="bathrooms" />
            </div>

            <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--color-deep-700)]">{t("from")}</p>
                <p className="font-display text-3xl text-[var(--color-deep-900)] price">
                  {formatPrice(villa.basePriceKes, "KES", locale)}
                </p>
                <p className="text-xs text-[var(--color-deep-700)]">{t("perNight")}</p>
              </div>
              <Button asChild variant="coral" size="lg">
                <Link href={`/stays/${villa.slug}`}>
                  View villa <ArrowUpRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center text-[var(--color-ocean-700)] mb-1">{icon}</div>
      <p className="font-display text-2xl text-[var(--color-deep-900)] leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-deep-700)] mt-1">{label}</p>
    </div>
  );
}
