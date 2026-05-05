import { PrismaClient } from "@prisma/client";
import { PROPERTIES, SAMPLE_REVIEWS } from "../src/lib/properties-data";

const db = new PrismaClient();

async function main() {
  console.log("Seeding...");
  for (const p of PROPERTIES) {
    const data = {
        slug: p.slug,
        name: p.name,
        type: p.type,
        shortDescription: p.shortDescription,
        description: p.description,
        location: p.location,
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        beds: p.beds,
        maxGuests: p.maxGuests,
        sizeM2: p.sizeM2,
        basePriceKes: p.basePriceKes,
        cleaningFeeKes: p.cleaningFeeKes,
        rating: p.rating,
        reviewCount: p.reviewCount,
        amenities: JSON.stringify(p.amenities),
        images: JSON.stringify(p.images),
        highlights: JSON.stringify(p.highlights),
        airbnbUrl: p.airbnbUrl,
        bookingUrl: p.bookingUrl,
    };
    await db.property.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }
  for (const r of SAMPLE_REVIEWS) {
    const prop = await db.property.findUnique({ where: { slug: r.propertySlug } });
    if (!prop) continue;
    const existing = await db.review.findFirst({ where: { propertyId: prop.id, authorName: r.authorName, body: r.body } });
    if (existing) continue;
    await db.review.create({
      data: {
        propertyId: prop.id,
        authorName: r.authorName,
        authorCountry: r.authorCountry,
        rating: r.rating,
        title: r.title,
        body: r.body,
        stayMonth: r.stayMonth,
        source: "website",
      },
    });
  }
  console.log("Done.");
}

main().finally(() => db.$disconnect());
