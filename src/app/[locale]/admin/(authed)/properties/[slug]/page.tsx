import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

async function update(formData: FormData) {
  "use server";
  const slug = String(formData.get("slug"));
  const property = await db.property.findUnique({ where: { slug } });
  if (!property) return;

  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await db.property.update({
    where: { slug },
    data: {
      name: String(formData.get("name") ?? property.name),
      shortDescription: String(formData.get("shortDescription") ?? property.shortDescription),
      description: String(formData.get("description") ?? property.description),
      basePriceKes: Number(formData.get("basePriceKes") ?? property.basePriceKes),
      cleaningFeeKes: Number(formData.get("cleaningFeeKes") ?? property.cleaningFeeKes),
      maxGuests: Number(formData.get("maxGuests") ?? property.maxGuests),
      icalAirbnb: String(formData.get("icalAirbnb") ?? "") || null,
      icalBooking: String(formData.get("icalBooking") ?? "") || null,
      images: JSON.stringify(images.length ? images : JSON.parse(property.images)),
    },
  });
  revalidatePath(`/admin/properties/${slug}`);
  revalidatePath(`/stays/${slug}`);
  redirect(`/admin/properties/${slug}?saved=1`);
}

export default async function AdminPropertyEdit({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const property = await db.property.findUnique({ where: { slug } });
  if (!property) notFound();
  const imagesText: string[] = JSON.parse(property.images);

  return (
    <div>
      <h1 className="font-display text-4xl text-[var(--color-deep-900)] mb-2">Edit · {property.name}</h1>
      {sp.saved && <p className="text-sm text-[var(--color-ocean-700)] mb-4">Changes saved.</p>}

      <form action={update} className="bg-white rounded-3xl p-6 shadow-[var(--shadow-soft)] space-y-5">
        <input type="hidden" name="slug" value={slug} />

        <Field label="Name"><Input name="name" defaultValue={property.name} /></Field>
        <Field label="Short description (1 line)">
          <Input name="shortDescription" defaultValue={property.shortDescription} />
        </Field>
        <Field label="Full description">
          <Textarea name="description" rows={8} defaultValue={property.description} />
        </Field>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Base price (KES/night)">
            <Input name="basePriceKes" type="number" defaultValue={property.basePriceKes} />
          </Field>
          <Field label="Cleaning fee (KES)">
            <Input name="cleaningFeeKes" type="number" defaultValue={property.cleaningFeeKes} />
          </Field>
          <Field label="Max guests">
            <Input name="maxGuests" type="number" defaultValue={property.maxGuests} />
          </Field>
        </div>

        <Field label="Photo URLs (one per line — replace placeholders with your real photos, e.g. uploaded to Cloudinary)">
          <Textarea name="images" rows={8} defaultValue={imagesText.join("\n")} className="font-mono text-xs" />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="iCal URL — Airbnb (paste from Airbnb host dashboard → Calendar → Availability → Sync calendars)">
            <Input name="icalAirbnb" defaultValue={property.icalAirbnb ?? ""} placeholder="https://www.airbnb.com/calendar/ical/..." />
          </Field>
          <Field label="iCal URL — Booking.com (Extranet → Rates & Availability → Sync calendars)">
            <Input name="icalBooking" defaultValue={property.icalBooking ?? ""} placeholder="https://admin.booking.com/hotel/hoteladmin/ical.html?..." />
          </Field>
        </div>

        <div className="rounded-2xl bg-[var(--color-sand-100)] p-4 text-sm">
          <p className="font-semibold mb-1">Export iCal for this property</p>
          <p className="text-[var(--color-deep-700)] text-xs mb-2">Paste this URL into the "Sync calendars" / "Import calendar" section of your Airbnb and Booking host dashboards.</p>
          <code className="text-xs break-all">{`/api/ical/${slug}/feed.ics`}</code>
        </div>

        <Button type="submit" variant="primary" size="lg">Save changes</Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[var(--color-deep-700)] mb-1.5">{label}</span>
      {children}
    </label>
  );
}
