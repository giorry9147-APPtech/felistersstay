import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

const schema = z.object({
  action: z.enum(["confirm", "reject"]),
  note: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const booking = await db.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const newStatus = parsed.data.action === "confirm" ? "paid" : "failed";
  const noteSuffix = parsed.data.note ? `\n[Admin]: ${parsed.data.note}` : "";

  await db.booking.update({
    where: { id },
    data: {
      paymentStatus: newStatus,
      notes: `${booking.notes ?? ""}${noteSuffix}`.trim() || null,
    },
  });

  return NextResponse.json({ ok: true, status: newStatus });
}
