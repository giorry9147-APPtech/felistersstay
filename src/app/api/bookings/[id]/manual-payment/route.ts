import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  // M-Pesa SMS confirmation code (e.g. "RKL12ABCD3"). Length 8-15, alphanumeric.
  mpesaCode: z.string().trim().min(8).max(15).regex(/^[A-Z0-9]+$/i, {
    message: "Code mag alleen letters en cijfers bevatten",
  }),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const booking = await db.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.paymentStatus === "paid") return NextResponse.json({ error: "Already paid" }, { status: 409 });

  const code = parsed.data.mpesaCode.toUpperCase();

  // Block obvious double-submits with the same code
  const sameCode = await db.booking.findFirst({
    where: { mpesaReceipt: code, NOT: { id } },
  });
  if (sameCode) {
    return NextResponse.json(
      { error: "Deze M-Pesa code is al voor een andere boeking gebruikt" },
      { status: 409 }
    );
  }

  await db.booking.update({
    where: { id },
    data: {
      paymentMethod: "manual_paybill",
      paymentStatus: "awaiting_verification",
      mpesaReceipt: code,
    },
  });

  return NextResponse.json({ ok: true, status: "awaiting_verification" });
}
