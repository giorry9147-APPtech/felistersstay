"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useTransition } from "react";

const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
] as const;

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const onSelect = (next: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error - dynamic params replacement
        { pathname, params },
        { locale: next }
      );
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="inline-flex items-center gap-2 px-3 h-11 rounded-full bg-white/80 border border-white/60 text-sm hover:bg-white transition-colors">
        <Globe size={16} />
        <span className="font-medium uppercase">{locale}</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[180px] rounded-2xl bg-white p-1.5 shadow-[var(--shadow-deep)] border border-[var(--color-sand-200)]"
        >
          {LOCALES.map((l) => (
            <DropdownMenu.Item
              key={l.code}
              onSelect={() => onSelect(l.code)}
              disabled={isPending}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-[var(--color-sand-100)] cursor-pointer outline-none data-[disabled]:opacity-50"
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{l.flag}</span>
                <span>{l.label}</span>
              </span>
              {locale === l.code && <Check size={14} className="text-[var(--color-ocean-600)]" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
