import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { stkPush } from "@/lib/mpesa";

const schema = z.object({
  bookingId: z.string(),
  phone: z.string().min(7),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const booking = await db.booking.findUnique({
    where: { id: parsed.data.bookingId },
    include: { property: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.paymentStatus === "paid") return NextResponse.json({ error: "Already paid" }, { status: 409 });

  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/mpesa/callback`;

  try {
    const result = await stkPush({
      phone: parsed.data.phone,
      amountKes: booking.totalKes,
      reference: booking.id.slice(0, 12),
      description: "Stay booking",
      callbackUrl,
    });

    await db.booking.update({
      where: { id: booking.id },
      data: { mpesaCheckoutId: result.CheckoutRequestID, guestPhone: parsed.data.phone },
    });

    return NextResponse.json({
      ok: true,
      checkoutId: result.CheckoutRequestID,
      message: result.CustomerMessage,
    });
  } catch (e: any) {
    const detail = e?.response?.data ?? { message: e?.message ?? "M-Pesa request failed" };
    return NextResponse.json({ ok: false, error: detail }, { status: 502 });
  }
}
