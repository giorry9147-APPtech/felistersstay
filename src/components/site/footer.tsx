import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, Instagram, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 bg-[var(--color-deep-900)] text-sand-50 overflow-hidden grain">
      <div className="absolute inset-x-0 -top-px h-24 bg-gradient-to-b from-[var(--color-sand-50)] to-transparent" style={{ background: "linear-gradient(to bottom, var(--color-sand-50), transparent)" }} />
      <div className="container-x relative pt-24 pb-12">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[var(--color-ocean-500)] grid place-items-center">
                <span className="font-display text-white text-2xl">F</span>
              </div>
              <div>
                <div className="font-display text-2xl text-white">Felister Stays</div>
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--color-ocean-300)]">Mtwapa · Kenya</div>
              </div>
            </div>
            <p className="mt-6 text-white/70 max-w-md leading-relaxed">{t("tagline")}.</p>
            <div className="mt-8">
              <p className="text-sm font-semibold text-white/90 mb-3">{t("newsletter")}</p>
              <form className="flex gap-2 max-w-sm">
                <Input placeholder={t("email")} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20" />
                <Button variant="coral" size="md" type="submit">{t("subscribe")}</Button>
              </form>
            </div>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-display text-white text-lg mb-4">{t("stays")}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/stays/villa-by-the-beach" className="hover:text-white">Villa by the Beach</Link></li>
              <li><Link href="/stays/sunny-sands-beach-apartment-3" className="hover:text-white">Sunny Sands #3</Link></li>
              <li><Link href="/stays/sunny-sands-beach-apartment-5" className="hover:text-white">Sunny Sands #5</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-display text-white text-lg mb-4">{t("company")}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-white">{tNav("about")}</Link></li>
              <li><Link href="/contact" className="hover:text-white">{tNav("contact")}</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-display text-white text-lg mb-4">{tNav("contact")}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2"><Mail size={16} /> bookings@felisterstays.com</li>
              <li className="flex items-center gap-2"><MessageCircle size={16} /> WhatsApp +254 700 000 000</li>
              <li className="flex items-center gap-2"><Instagram size={16} /> @felisterstays</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-3 justify-between text-xs text-white/50">
          <p>© {year} Felister Stays. {t("rights")}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-white">{t("terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
