"use client";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="container-x mb-32">
      <div className="relative overflow-hidden rounded-[2rem] grain">
        <Image
          src="/properties/villa-by-the-beach/photo-05.jpg"
          alt="Villa by the Beach"
          width={2400}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-deep-900)]/85 via-[var(--color-deep-900)]/55 to-transparent" />

        <div className="relative px-8 py-20 md:px-16 md:py-28 max-w-2xl text-white">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-coral-300)] font-semibold mb-4">Ready when you are</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
            Your week on the<br />Kenyan coast<br />starts here.
          </h2>
          <p className="mt-6 text-white/85 text-lg max-w-md">
            Pick your dates, check live availability, pay with M-Pesa. The whole booking takes less than a minute.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="coral" size="lg">
              <Link href="/stays">
                Find your stay <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link href="/contact">Talk to Felister</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
