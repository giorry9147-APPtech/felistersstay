import { db } from "@/lib/db";
import { syncAllProperties } from "@/lib/ical";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RefreshCw } from "lucide-react";

async function runSync() {
  "use server";
  await syncAllProperties();
  revalidatePath("/admin/sync");
  redirect("/admin/sync?synced=1");
}

export default async function AdminSync({ searchParams }: { searchParams: Promise<{ synced?: string }> }) {
  const sp = await searchParams;
  const properties = await db.property.findMany({ include: { blockedDates: true } });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div>
      <h1 className="font-display text-4xl text-[var(--color-deep-900)] mb-2">Calendar sync</h1>
      <p className="text-[var(--color-deep-700)] mb-8 max-w-2xl">
        Two-way sync with Airbnb &amp; Booking.com using iCal. Paste our feed URL into their host dashboards
        — and paste their iCal URLs into each property's edit page.
      </p>

      {sp.synced && (
        <div className="mb-6 rounded-2xl bg-[var(--color-ocean-50)] border border-[var(--color-ocean-200)] p-4 text-sm text-[var(--color-ocean-800)]">
          Calendars synced. Latest blocks pulled from Airbnb &amp; Booking.com.
        </div>
      )}

      <form action={runSync} className="mb-8">
        <Button type="submit" variant="primary"><RefreshCw size={16} /> Sync now</Button>
      </form>

      <div className="space-y-4">
        {properties.map((p) => {
          const airbnbBlocks = p.blockedDates.filter((b) => b.source === "airbnb").length;
          const bookingBlocks = p.blockedDates.filter((b) => b.source === "booking").length;
          const manualBlocks = p.blockedDates.filter((b) => b.source === "manual").length;
          return (
            <div key={p.id} className="bg-white rounded-3xl p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-display text-xl text-[var(--color-deep-900)] mb-1">{p.name}</h3>
              <div className="flex gap-2 flex-wrap text-xs mb-3">
                <Badge tone="ocean">Airbnb blocks: {airbnbBlocks}</Badge>
                <Badge tone="coral">Booking blocks: {bookingBlocks}</Badge>
                <Badge tone="sand">Manual blocks: {manualBlocks}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <Row label="Our feed (give this to Airbnb & Booking)">
                  <code className="text-xs break-all">{baseUrl}/api/ical/{p.slug}/feed.ics</code>
                </Row>
                <Row label="Airbnb iCal (we read from this)">
                  <code className="text-xs break-all text-[var(--color-deep-700)]">{p.icalAirbnb || "— not set —"}</code>
                </Row>
                <Row label="Booking iCal (we read from this)">
                  <code className="text-xs break-all text-[var(--color-deep-700)]">{p.icalBooking || "— not set —"}</code>
                </Row>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-3xl bg-[var(--color-sand-100)] p-6 text-sm">
        <h3 className="font-display text-lg text-[var(--color-deep-900)] mb-2">How to set this up (5 min per property)</h3>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--color-deep-700)]">
          <li><strong>On Airbnb:</strong> open the listing → Calendar → Availability → "Sync calendars" → "Import calendar". Paste our feed URL.</li>
          <li><strong>On Booking.com:</strong> Extranet → Rates &amp; Availability → "Sync calendars" → Add iCal feed. Paste our feed URL.</li>
          <li><strong>Then come back here:</strong> from each Airbnb / Booking dashboard, copy <em>their</em> iCal export URL into the property edit page.</li>
          <li><strong>Run "Sync now"</strong> to pull the first time. After that, set a cron to call <code>/api/ical/sync</code> hourly.</li>
        </ol>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-[200px_1fr] gap-3">
      <span className="text-xs font-semibold text-[var(--color-deep-700)] mt-1">{label}</span>
      <div className="bg-[var(--color-sand-50)] rounded-xl px-3 py-2 break-all">{children}</div>
    </div>
  );
}
