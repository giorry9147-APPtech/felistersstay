"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Review, Property } from "@prisma/client";

export function Testimonials({
  reviews,
}: {
  reviews: (Review & { property: Pick<Property, "name" | "slug" | "images"> })[];
}) {
  return (
    <section className="container-x py-24">
      <div className="max-w-2xl mb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-coral-600)] font-semibold mb-4">From our guests</p>
        <h2 className="font-display text-3xl md:text-5xl text-[var(--color-deep-900)] leading-[1.1]">
          Loved by travellers from around the world
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.figure
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="bg-white rounded-[var(--radius-card)] p-7 shadow-[var(--shadow-soft)] flex flex-col"
          >
            <div className="flex gap-1 text-[var(--color-coral-500)] mb-4">
              {Array.from({ length: r.rating }).map((_, k) => (
                <Star key={k} size={14} className="fill-current" />
              ))}
            </div>
            {r.title && <h3 className="font-display text-xl mb-2 text-[var(--color-deep-900)]">{r.title}</h3>}
            <blockquote className="text-[var(--color-deep-700)] leading-relaxed text-sm flex-1">
              "{r.body}"
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-[var(--color-sand-200)] flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-[var(--color-deep-900)]">{r.authorName}{r.authorCountry ? `, ${r.authorCountry}` : ""}</p>
                <p className="text-[var(--color-deep-700)]">Stayed at {r.property.name} · {r.stayMonth}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
