import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { nightsBetween } from "@/lib/utils";

const bookingSchema = z.object({
  propertyId: z.string(),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(7),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().positive(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const property = await db.property.findUnique({ where: { id: data.propertyId } });
  if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });

  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  if (checkOut <= checkIn) {
    return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 400 });
  }

  // Check for overlapping bookings
  const conflicts = await db.booking.count({
    where: {
      propertyId: property.id,
      paymentStatus: { in: ["paid", "pending"] },
      AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
    },
  });
  const blockConflicts = await db.blockedDate.count({
    where: {
      propertyId: property.id,
      AND: [{ startDate: { lt: checkOut } }, { endDate: { gt: checkIn } }],
    },
  });
  if (conflicts > 0 || blockConflicts > 0) {
    return NextResponse.json({ error: "Selected dates are no longer available" }, { status: 409 });
  }

  if (data.guests > property.maxGuests) {
    return NextResponse.json({ error: "Too many guests" }, { status: 400 });
  }

  const nights = nightsBetween(checkIn, checkOut);
  const subtotalKes = nights * property.basePriceKes;
  const totalKes = subtotalKes + property.cleaningFeeKes;

  const booking = await db.booking.create({
    data: {
      propertyId: property.id,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      checkIn,
      checkOut,
      guests: data.guests,
      nights,
      subtotalKes,
      cleaningFeeKes: property.cleaningFeeKes,
      totalKes,
      paymentMethod: "mpesa",
      paymentStatus: "pending",
      notes: data.notes,
      source: "website",
    },
  });

  return NextResponse.json({ booking });
}
