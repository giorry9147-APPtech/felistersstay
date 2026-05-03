"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Bed, Bath, Users, Star, MapPin, Wifi, Snowflake, Waves, Car, Tv, Utensils,
  Coffee, Shield, Home, Briefcase, Trees, Flame, Sparkles, Plane, Wind,
  Lock, ArrowUpRight, CalendarDays, Heart, Share2, X, Check,
  ConciergeBell, Luggage, Sun, Ban, Flame as FlameIcon, Armchair,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingWidget } from "./booking-widget";
import { GalleryLightbox } from "./gallery-lightbox";
import { LocationMap } from "./location-map";
import { ReviewsSection } from "./reviews-section";
import type { Property, Review, BlockedDate, Booking } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

const AMENITY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  wifi: Wifi, pool: Waves, ac: Snowflake, kitchen: Utensils, parking: Car,
  beach: Waves, tv: Tv, washer: Wind, workspace: Briefcase, garden: Trees,
  bbq: Flame, security: Shield, cleaning: Sparkles, breakfast: Coffee,
  transport: Plane, balcony: Home, linen: Bed, safe: Lock, iron: Home,
  hairdryer: Wind, coffee: Coffee, babycot: Bed, petfriendly: Heart,
  concierge: ConciergeBell, luggage: Luggage, terrace: Sun, nonsmoking: Ban,
  fireplace: FlameIcon, patio: Armchair,
};

type FullProperty = Property & {
  reviews: Review[];
  blockedDates: BlockedDate[];
  bookings: Booking[];
};

export function PropertyDetail({ property }: { property: FullProperty }) {
  const t = useTranslations("property");
  const tA = useTranslations("amenities");
  const locale = useLocale();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const images: string[] = JSON.parse(property.images);
  const amenities: string[] = JSON.parse(property.amenities);
  const highlights: { icon: string; title: string; text: string }[] = JSON.parse(property.highlights);

  return (
    <article>
      {/* Hero gallery */}
      <section className="container-x pt-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[60vh] min-h-[420px] rounded-[2rem] overflow-hidden">
          <button
            onClick={() => { setStartIndex(0); setLightboxOpen(true); }}
            className="relative col-span-4 lg:col-span-2 row-span-2 group"
          >
            <Image src={images[0]} alt={property.name} fill className="object-cover transition-transform group-hover:scale-105" priority sizes="50vw" />
          </button>
          {images.slice(1, 5).map((img, i) => (
            <button
              key={img}
              onClick={() => { setStartIndex(i + 1); setLightboxOpen(true); }}
              className="hidden lg:block relative group"
            >
              <Image src={img} alt={`${property.name} ${i + 2}`} fill className="object-cover transition-transform group-hover:scale-105" sizes="25vw" />
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-3">
          <Button variant="glass" onClick={() => { setStartIndex(0); setLightboxOpen(true); }}>
            <Sparkles size={14} /> {t("showAllPhotos")} ({images.length})
          </Button>
        </div>
      </section>

      {/* Title & meta */}
      <section className="container-x mt-12">
        <div className="flex flex-wrap items-start gap-6 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge tone="ocean"><MapPin size={10} /> {property.location}</Badge>
              {property.type === "villa" && <Badge tone="coral">Villa</Badge>}
              {property.reviewCount > 0 ? (
                <Badge tone="sand"><Star size={10} className="fill-current" /> {property.rating.toFixed(2)} · {property.reviewCount} reviews</Badge>
              ) : (
                <Badge tone="coral">New listing</Badge>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-[var(--color-deep-900)]">{property.name}</h1>
            <div className="mt-5 flex items-center gap-4 text-sm text-[var(--color-deep-700)] flex-wrap">
              <span className="flex items-center gap-1.5"><Users size={16} /> {property.maxGuests} guests</span>
              <span className="flex items-center gap-1.5"><Bed size={16} /> {property.bedrooms} bedrooms · {property.beds} beds</span>
              <span className="flex items-center gap-1.5"><Bath size={16} /> {property.bathrooms} bathrooms</span>
              {property.sizeM2 && <span>· {property.sizeM2} m²</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" aria-label="favourite"><Heart size={18} /></Button>
            <Button variant="ghost" size="icon" aria-label="share"><Share2 size={18} /></Button>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container-x mt-12 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-12">
          {/* Highlights */}
          <div className="grid gap-3 sm:grid-cols-2">
            {highlights.map((h) => (
              <div key={h.title} className="bg-white rounded-2xl p-5 shadow-[var(--shadow-soft)] flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[var(--color-ocean-100)] grid place-items-center text-[var(--color-ocean-700)]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-display text-lg text-[var(--color-deep-900)]">{h.title}</h4>
                  <p className="text-sm text-[var(--color-deep-700)] mt-1">{h.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="font-display text-3xl text-[var(--color-deep-900)] mb-4">{t("overview")}</h2>
            <p className="text-[var(--color-deep-700)] leading-relaxed text-base whitespace-pre-line">{property.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="font-display text-3xl text-[var(--color-deep-900)] mb-6">{t("amenities")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {amenities.map((key) => {
                const Icon = AMENITY_ICONS[key] ?? Home;
                return (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-white">
                    <Icon size={18} />
                    <span className="text-sm text-[var(--color-deep-900)]">{tA(key)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="font-display text-3xl text-[var(--color-deep-900)] mb-4">{t("location")}</h2>
            <p className="text-[var(--color-deep-700)] mb-4">{property.address}</p>
            <LocationMap lat={property.latitude} lng={property.longitude} title={property.name} />
          </div>

          {/* Reviews */}
          <ReviewsSection reviews={property.reviews} rating={property.rating} count={property.reviewCount} />
        </div>

        {/* Sticky booking widget */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <BookingWidget property={property} />
          </div>
        </aside>
      </section>

      {lightboxOpen && (
        <GalleryLightbox images={images} startIndex={startIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </article>
  );
}
