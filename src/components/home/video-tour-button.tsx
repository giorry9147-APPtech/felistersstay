"use client";
import { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Play, X, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoTourButton({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay when opening, pause when closing
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) {
      v.currentTime = 0;
      v.play().catch(() => { /* autoplay blocked — user can press play */ });
    } else {
      v.pause();
    }
  }, [open]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="glass" size="lg">
          <Play size={16} /> {label}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-0 z-[101] grid place-items-center p-4 md:p-8 outline-none"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{label}</Dialog.Title>
          <div className="relative w-full max-w-5xl aspect-video">
            <video
              ref={videoRef}
              src="/tour.mp4"
              className="w-full h-full rounded-2xl shadow-[var(--shadow-deep)] bg-black"
              controls
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          </div>
          <Dialog.Close
            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 grid place-items-center text-white transition"
            aria-label="Close"
          >
            <X size={22} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
