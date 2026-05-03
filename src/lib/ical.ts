// iCal generation + parsing for Airbnb / Booking.com calendar sync.
//
// Two-way flow:
//   • EXPORT: /api/ical/[slug]/feed.ics — Airbnb & Booking import this URL.
//     They poll it every 1-4 hours and mark those dates unavailable on their side.
//   • IMPORT: /api/ical/sync — pulls the iCal URLs Airbnb & Booking expose from
//     each host dashboard, parses them, and writes BlockedDate rows on our side.
//
// Run /api/ical/sync on a cron (Vercel Cron / GitHub Actions / any scheduler).

import ical, { ICalCalendarMethod } from "ical-generator";
import nodeIcal from "node-ical";
import { db } from "./db";

export async function buildPropertyFeed(slug: string): Promise<string> {
  const property = await db.property.findUnique({
    where: { slug },
    include: {
      bookings: { where: { paymentStatus: { in: ["paid", "pending"] } } },
      blockedDates: true,
    },
  });
  if (!property) throw new Error("Property not found");

  const cal = ical({
    name: `Felister Stays — ${property.name}`,
    prodId: { company: "Felister Stays", product: "Booking Sync", language: "EN" },
    timezone: "Africa/Nairobi",
    method: ICalCalendarMethod.PUBLISH,
  });

  for (const b of property.bookings) {
    cal.createEvent({
      id: `booking-${b.id}@felisterstays.com`,
      start: b.checkIn,
      end: b.checkOut,
      allDay: true,
      summary: `Reserved (Felister Stays)`,
      description: `Direct booking via felisterstays.com — guest ${b.guestName}`,
    });
  }

  for (const bd of property.blockedDates) {
    if (bd.source === "manual") {
      cal.createEvent({
        id: `block-${bd.id}@felisterstays.com`,
        start: bd.startDate,
        end: bd.endDate,
        allDay: true,
        summary: bd.summary || "Unavailable",
      });
    }
  }

  return cal.toString();
}

export async function importIcal(propertyId: string, source: "airbnb" | "booking", url: string) {
  if (!url) return { added: 0, removed: 0, kept: 0 };
  const parsed = await nodeIcal.async.fromURL(url);

  const incoming: { externalId: string; start: Date; end: Date; summary: string }[] = [];
  for (const ev of Object.values(parsed)) {
    if ((ev as any).type !== "VEVENT") continue;
    const e = ev as any;
    incoming.push({
      externalId: String(e.uid),
      start: new Date(e.start),
      end: new Date(e.end ?? e.start),
      summary: String(e.summary ?? ""),
    });
  }

  const existing = await db.blockedDate.findMany({ where: { propertyId, source } });
  const incomingIds = new Set(incoming.map((i) => i.externalId));
  const existingIds = new Set(existing.map((e) => e.externalId).filter(Boolean) as string[]);

  // Remove blocks that no longer exist remotely
  const toRemove = existing.filter((e) => e.externalId && !incomingIds.has(e.externalId));
  if (toRemove.length) {
    await db.blockedDate.deleteMany({ where: { id: { in: toRemove.map((b) => b.id) } } });
  }

  // Upsert all incoming
  let added = 0;
  for (const i of incoming) {
    const existed = existingIds.has(i.externalId);
    await db.blockedDate.upsert({
      where: {
        propertyId_source_externalId: {
          propertyId,
          source,
          externalId: i.externalId,
        },
      },
      update: { startDate: i.start, endDate: i.end, summary: i.summary },
      create: {
        propertyId,
        source,
        externalId: i.externalId,
        startDate: i.start,
        endDate: i.end,
        summary: i.summary,
      },
    });
    if (!existed) added++;
  }

  return { added, removed: toRemove.length, kept: existing.length - toRemove.length };
}

export async function syncAllProperties() {
  const properties = await db.property.findMany();
  const results: any[] = [];
  for (const p of properties) {
    const r: any = { property: p.slug };
    if (p.icalAirbnb) r.airbnb = await importIcal(p.id, "airbnb", p.icalAirbnb).catch((e) => ({ error: e.message }));
    if (p.icalBooking) r.booking = await importIcal(p.id, "booking", p.icalBooking).catch((e) => ({ error: e.message }));
    results.push(r);
  }
  return results;
}
