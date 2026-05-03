"use client";
import { Star } from "lucide-react";
import type { Review } from "@prisma/client";

export function ReviewsSection({ reviews, rating, count }: { reviews: Review[]; rating: number; count: number }) {
  if (count === 0) {
    return (
      <div className="bg-[var(--color-coral-50)] border border-[var(--color-coral-100)] rounded-2xl p-6 text-sm text-[var(--color-coral-800)]">
        <p className="font-display text-lg text-[var(--color-coral-700)] mb-1">Brand new on the platform</p>
        <p>No reviews here yet — be one of the first guests. Felister responds personally on WhatsApp.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Star size={28} className="fill-[var(--color-coral-500)] text-[var(--color-coral-500)]" />
        <h2 className="font-display text-3xl text-[var(--color-deep-900)]">{rating.toFixed(2)}</h2>
        <span className="text-[var(--color-deep-700)]">· {count} reviews</span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {reviews.slice(0, 6).map((r) => (
          <figure key={r.id} className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[var(--color-ocean-100)] grid place-items-center font-display text-[var(--color-ocean-700)]">
                {r.authorName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-deep-900)] text-sm">{r.authorName}</p>
                <p className="text-xs text-[var(--color-deep-700)]">{r.authorCountry} · {r.stayMonth}</p>
              </div>
              <div className="ml-auto flex gap-0.5 text-[var(--color-coral-500)]">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} className="fill-current" />)}
              </div>
            </div>
            {r.title && <p className="font-display text-lg mb-1 text-[var(--color-deep-900)]">{r.title}</p>}
            <blockquote className="text-sm text-[var(--color-deep-700)] leading-relaxed">"{r.body}"</blockquote>
          </figure>
        ))}
      </div>
    </div>
  );
}
