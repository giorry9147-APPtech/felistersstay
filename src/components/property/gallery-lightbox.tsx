"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function GalleryLightbox({
  images, startIndex = 0, onClose,
}: { images: string[]; startIndex?: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--color-deep-900)]/95 backdrop-blur-md grid place-items-center p-4">
      <button onClick={onClose} className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 grid place-items-center text-white hover:bg-white/20" aria-label="Close">
        <X size={20} />
      </button>
      <div className="absolute top-6 left-6 text-white text-sm">{idx + 1} / {images.length}</div>

      <button
        onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
        className="absolute left-6 h-12 w-12 rounded-full bg-white/10 grid place-items-center text-white hover:bg-white/20"
        aria-label="Previous"
      ><ChevronLeft size={22} /></button>

      <div className="relative w-full max-w-6xl aspect-[16/10]">
        <Image src={images[idx]} alt={`Photo ${idx + 1}`} fill className="object-contain" sizes="90vw" priority />
      </div>

      <button
        onClick={() => setIdx((i) => (i + 1) % images.length)}
        className="absolute right-6 h-12 w-12 rounded-full bg-white/10 grid place-items-center text-white hover:bg-white/20"
        aria-label="Next"
      ><ChevronRight size={22} /></button>

      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2 overflow-x-auto px-6">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setIdx(i)}
            className={`relative shrink-0 h-16 w-24 rounded-lg overflow-hidden ring-2 transition ${i === idx ? "ring-white" : "ring-transparent opacity-60 hover:opacity-100"}`}
          >
            <Image src={img} alt="" fill className="object-cover" sizes="96px" />
          </button>
        ))}
      </div>
    </div>
  );
}
