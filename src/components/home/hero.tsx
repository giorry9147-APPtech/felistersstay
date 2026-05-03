"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, MapPin, Play } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/properties/villa-by-the-beach/photo-01.jpg"
          alt="Villa by the Beach"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-deep-900)]/40 via-[var(--color-deep-900)]/20 to-[var(--color-sand-50)]" />
      </div>

      <div className="container-x pt-20 pb-32 lg:pt-32 lg:pb-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <Badge tone="white" className="mb-6">
            <MapPin size={12} /> {t("eyebrow")}
          </Badge>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[1.02]">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">{t("subtitle")}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="coral" size="lg">
              <Link href="/stays">
                {t("cta")} <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link href="/about">
                <Play size={16} /> {t("secondary")}
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl">
            <Stat value="3" label={t("stat1")} />
            <Stat value="4.9" icon={<Star size={14} className="fill-[var(--color-coral-400)] text-[var(--color-coral-400)]" />} label={t("stat2")} />
            <Stat value="200+" label={t("stat3")} />
          </div>
        </motion.div>
      </div>

      <FloatingCards />
    </section>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-1.5 font-display text-2xl text-[var(--color-deep-900)]">
        {icon}
        <span>{value}</span>
      </div>
      <p className="text-xs text-[var(--color-deep-700)] mt-1">{label}</p>
    </div>
  );
}

function FloatingCards() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 40, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hidden lg:block absolute right-12 top-32"
      >
        <div className="glass rounded-3xl p-5 max-w-xs animate-float">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="Felister"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-[var(--color-deep-700)]">Hosted by</p>
              <p className="font-display text-lg leading-tight">Felister</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-[var(--color-deep-700)]">
            <Star size={12} className="fill-[var(--color-coral-400)] text-[var(--color-coral-400)]" />
            <span className="font-semibold">Superhost</span> · 200+ stays
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40, y: 40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="hidden lg:block absolute right-24 bottom-44"
      >
        <div className="glass rounded-3xl p-5 max-w-xs">
          <p className="text-xs uppercase tracking-widest text-[var(--color-ocean-700)] font-semibold mb-2">Pay how you want</p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#00A859] grid place-items-center text-white font-bold text-xs">M</div>
            <div>
              <p className="font-semibold text-sm">M-Pesa STK push</p>
              <p className="text-xs text-[var(--color-deep-700)]">Or Visa, Mastercard</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
