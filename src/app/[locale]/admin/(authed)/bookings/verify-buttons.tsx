"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function VerifyButtons({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState<"confirm" | "reject" | null>(null);

  const act = async (action: "confirm" | "reject") => {
    if (action === "reject" && !confirm("Reject this booking? This sets it to 'failed' and sends nothing back.")) return;
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || e?.error || "Verification failed");
      }
      toast.success(action === "confirm" ? "Booking confirmed as paid" : "Booking rejected");
      startTransition(() => router.refresh());
    } catch (e: any) {
      toast.error(e.message ?? "Action failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => act("confirm")}
        disabled={busy !== null || isPending}
        variant="primary"
        size="sm"
      >
        {busy === "confirm" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        Confirm paid
      </Button>
      <Button
        onClick={() => act("reject")}
        disabled={busy !== null || isPending}
        variant="ghost"
        size="sm"
      >
        {busy === "reject" ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
        Reject
      </Button>
    </div>
  );
}
