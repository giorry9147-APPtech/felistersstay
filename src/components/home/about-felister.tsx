"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function AboutFelister() {
  const t = useTranslations("about");
  const tNav = useTranslations("nav");

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[4/5] rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-deep)]">
            <Image
              src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1200&q=85"
              alt="Felister"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden md:block">
            <div className="bg-[var(--color-coral-500)] text-white rounded-2xl p-5 shadow-[var(--shadow-warm)] max-w-[220px]">
              <Quote size={20} className="opacity-70" />
              <p className="font-display italic text-3xl leading-tight mt-2 tracking-tight">Karibu sana</p>
              <p className="text-xs opacity-80 mt-1 tracking-wide uppercase">— welcome, in Swahili</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-ocean-700)] font-semibold mb-4">Your host</p>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--color-deep-900)] leading-[1.05]">{t("title")}</h2>
          <p className="font-display italic text-2xl md:text-3xl text-[var(--color-coral-600)] mt-3 tracking-tight">{t("subtitle")}</p>
          <p className="mt-6 text-lg text-[var(--color-deep-700)] leading-relaxed max-w-xl">{t("body")}</p>
          <div className="mt-8">
            <Button asChild variant="primary">
              <Link href="/about">More about Felister</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
