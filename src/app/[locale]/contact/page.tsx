import { setRequestLocale } from "next-intl/server";
import { Mail, MessageCircle, Instagram, MapPin, Phone, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254700000000";

  return (
    <div className="container-x py-16 md:py-24 grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Badge tone="ocean" className="mb-4">Get in touch</Badge>
        <h1 className="font-display text-4xl md:text-6xl text-[var(--color-deep-900)] leading-[1.05]">Talk to Felister</h1>
        <p className="mt-6 text-lg text-[var(--color-deep-700)] leading-relaxed max-w-md">
          Questions about a property, special requests, custom group rates? The fastest way to reach me is WhatsApp — I usually reply within minutes.
        </p>

        <div className="mt-8 space-y-3">
          <Card icon={<MessageCircle size={18} />} title="WhatsApp" body={`+${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`} href={`https://wa.me/${phone}`} />
          <Card icon={<Mail size={18} />} title="Email" body="bookings@felisterstays.com" href="mailto:bookings@felisterstays.com" />
          <Card icon={<Instagram size={18} />} title="Instagram" body="@felisterstays" href="https://instagram.com/felisterstays" />
          <Card icon={<MapPin size={18} />} title="Location" body="Mtwapa, Kilifi County, Kenya" />
          <Card icon={<Clock size={18} />} title="Reply time" body="Usually within 1 hour, 7 am – 10 pm EAT" />
        </div>
      </div>

      <div className="lg:col-span-7">
        <form className="bg-white rounded-[2rem] p-8 shadow-[var(--shadow-soft)] space-y-4">
          <h2 className="font-display text-2xl text-[var(--color-deep-900)]">Send me a message</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Your name" required />
            <Input type="email" placeholder="Email" required />
          </div>
          <Input placeholder="Subject" />
          <Textarea placeholder="Your message" rows={6} required />
          <Button variant="coral" size="lg" className="w-full">Send</Button>
        </form>
      </div>
    </div>
  );
}

function Card({ icon, title, body, href }: { icon: React.ReactNode; title: string; body: string; href?: string }) {
  const content = (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] transition-shadow">
      <div className="h-10 w-10 rounded-xl bg-[var(--color-ocean-100)] grid place-items-center text-[var(--color-ocean-700)]">{icon}</div>
      <div>
        <p className="text-xs text-[var(--color-deep-700)] font-semibold uppercase tracking-wider">{title}</p>
        <p className="text-sm text-[var(--color-deep-900)]">{body}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer" className="block">{content}</a> : content;
}
