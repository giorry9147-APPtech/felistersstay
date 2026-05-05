import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, Instagram, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "31633085773";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "bookings@felisterstays.com";
  // Pretty-format the phone number for display: 31633085773 → +31 633 085 773
  const whatsappDisplay = whatsapp.startsWith("31") && whatsapp.length === 11
    ? `+31 ${whatsapp.slice(2, 5)} ${whatsapp.slice(5, 8)} ${whatsapp.slice(8)}`
    : `+${whatsapp}`;

  return (
    <footer className="relative mt-32 bg-[var(--color-deep-900)] text-sand-50 overflow-hidden grain">
      <div className="absolute inset-x-0 -top-px h-24 bg-gradient-to-b from-[var(--color-sand-50)] to-transparent" style={{ background: "linear-gradient(to bottom, var(--color-sand-50), transparent)" }} />
      <div className="container-x relative pt-24 pb-12">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white p-2">
                <Image
                  src="/logo.png"
                  alt="Felisters Stay"
                  width={1408}
                  height={768}
                  className="h-10 w-auto"
                  sizes="160px"
                />
              </div>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--color-ocean-300)]">Mombasa Beach · Kenya</div>
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
              <li><Link href="/stays/sunny-sands-beach-apartment-3" className="hover:text-white">Apartment 3</Link></li>
              <li><Link href="/stays/sunny-sands-beach-apartment-5" className="hover:text-white">Apartment 5</Link></li>
              <li><Link href="/stays/tiny-house-on-a-farm" className="hover:text-white">Tiny House on a Farm</Link></li>
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
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={16} /> {email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp {whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/felisterstays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Instagram size={16} /> @felisterstays
                </a>
              </li>
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
