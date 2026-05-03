"use client";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254700000000";
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 rounded-full bg-[#25d366] text-white px-4 h-14 shadow-[0_18px_40px_-12px_rgba(37,211,102,0.6)] hover:scale-105 transition-transform"
    >
      <MessageCircle size={24} />
      <span className="hidden sm:inline font-semibold">Chat with Felister</span>
    </a>
  );
}
