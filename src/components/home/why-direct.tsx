"use client";
import { motion } from "framer-motion";
import { Smartphone, BadgePercent, MessageCircle, ShieldCheck } from "lucide-react";

const REASONS = [
  {
    icon: Smartphone,
    title: "Pay with M-Pesa",
    body: "STK push straight to your phone. No card needed, no foreign-exchange fees. Same security, much easier.",
  },
  {
    icon: BadgePercent,
    title: "Save up to 15%",
    body: "Booking direct skips the platform fees Airbnb and Booking charge — that saving comes back to you.",
  },
  {
    icon: MessageCircle,
    title: "Talk to the host",
    body: "Felister answers WhatsApp herself, usually within minutes. No middleman, no scripted replies.",
  },
  {
    icon: ShieldCheck,
    title: "Same calendar, no double-bookings",
    body: "Our system syncs availability with Airbnb and Booking — when one closes, all close.",
  },
];

export function WhyDirect() {
  return (
    <section className="container-x py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-coral-600)] font-semibold mb-4">Why book direct</p>
        <h2 className="font-display text-3xl md:text-5xl text-[var(--color-deep-900)] leading-[1.05]">
          Same homes. <span className="italic text-[var(--color-coral-600)]">Better deal.</span>
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative bg-white rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] transition-shadow"
          >
            <div className="h-12 w-12 rounded-2xl bg-[var(--color-ocean-100)] grid place-items-center text-[var(--color-ocean-700)] mb-5">
              <r.icon size={22} />
            </div>
            <h3 className="font-display text-xl text-[var(--color-deep-900)] mb-2">{r.title}</h3>
            <p className="text-sm text-[var(--color-deep-700)] leading-relaxed">{r.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
