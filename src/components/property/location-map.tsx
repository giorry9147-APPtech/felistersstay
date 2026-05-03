"use client";
import { MapPin } from "lucide-react";

export function LocationMap({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  // OpenStreetMap embed — no API key required
  const bbox = [lng - 0.015, lat - 0.012, lng + 0.015, lat + 0.012].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden ring-1 ring-[var(--color-sand-200)]">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
        <MapPin size={12} className="text-[var(--color-coral-500)]" /> {title}
      </div>
    </div>
  );
}
