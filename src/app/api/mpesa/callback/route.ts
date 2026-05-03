import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseCallback } from "@/lib/mpesa";

// Daraja calls this with payment results.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const r = parseCallback(body);
  if (!r.checkoutId) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  const booking = await db.booking.findFirst({ where: { mpesaCheckoutId: r.checkoutId } });
  if (!booking) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  if (r.resultCode === 0) {
    await db.booking.update({
      where: { id: booking.id },
      data: { paymentStatus: "paid", mpesaReceipt: r.receipt },
    });
  } else {
    await db.booking.update({
      where: { id: booking.id },
      data: { paymentStatus: "failed", notes: `${booking.notes ?? ""}\nM-Pesa: ${r.resultDesc}` },
    });
  }

  // Daraja expects an acknowledgement
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
