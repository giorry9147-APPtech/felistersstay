"use client";
import { motion } from "framer-motion";
import { Waves, Palmtree, Sun, Compass, Utensils, Music } from "lucide-react";

const ITEMS = [
  { icon: Waves, label: "Indian Ocean swims" },
  { icon: Palmtree, label: "Palm-shaded mornings" },
  { icon: Sun, label: "Sunrise dhow tours" },
  { icon: Compass, label: "Jumba la Mtwana ruins" },
  { icon: Utensils, label: "Fresh-catch dinners" },
  { icon: Music, label: "Mtwapa night life" },
];

export function ExperienceStrip() {
  return (
    <section className="relative my-16 overflow-hidden">
      <div className="gradient-tropic py-6">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...ITEMS, ...ITEMS, ...ITEMS].map((it, i) => (
            <div key={i} className="flex items-center gap-3 px-8 text-white">
              <it.icon size={20} className="opacity-90" />
              <span className="font-display text-2xl tracking-wide">{it.label}</span>
              <span className="text-white/40">•</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        :global(.animate-marquee) { animation: marquee 40s linear infinite; }
      `}</style>
    </section>
  );
}
