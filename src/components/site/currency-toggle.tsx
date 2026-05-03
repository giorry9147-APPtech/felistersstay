"use client";

const CURRENCIES = ["KES", "USD", "EUR"] as const;
type Currency = (typeof CURRENCIES)[number];

export function CurrencyToggle({ value, onChange }: { value: Currency; onChange: (v: Currency) => void }) {
  return (
    <div className="inline-flex p-1 rounded-full bg-[var(--color-sand-100)] text-xs">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 h-7 rounded-full font-semibold transition-colors ${
            value === c ? "bg-[var(--color-deep-900)] text-white" : "text-[var(--color-deep-700)] hover:text-[var(--color-deep-900)]"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
