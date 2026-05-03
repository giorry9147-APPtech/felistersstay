"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LangSwitcher } from "./lang-switcher";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/stays", label: t("stays") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-white/40" />
      <div className="container-x relative flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 rounded-2xl bg-[var(--color-ocean-600)] grid place-items-center shadow-[var(--shadow-soft)]">
            <span className="font-display text-white text-xl">F</span>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[var(--color-coral-400)]" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg text-[var(--color-deep-900)]">Felister Stays</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-ocean-700)]">Mtwapa · Kenya</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--color-deep-900)] text-white"
                    : "text-[var(--color-deep-900)] hover:bg-[var(--color-sand-100)]"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LangSwitcher />
          <Button asChild variant="coral" size="md">
            <Link href="/stays">{t("bookNow")}</Link>
          </Button>
        </div>

        <button
          className="md:hidden h-11 w-11 grid place-items-center rounded-full bg-white/80"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden relative bg-white border-b border-white/40">
          <div className="container-x py-6 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl hover:bg-[var(--color-sand-100)]"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center justify-between">
              <LangSwitcher />
              <Button asChild variant="coral">
                <Link href="/stays" onClick={() => setOpen(false)}>{t("bookNow")}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
