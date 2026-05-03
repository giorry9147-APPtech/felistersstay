import { db } from "@/lib/db";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminProperties() {
  const properties = await db.property.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-display text-4xl text-[var(--color-deep-900)] mb-2">Properties</h1>
      <p className="text-[var(--color-deep-700)] mb-8">Update photos, prices and descriptions per property.</p>

      <div className="grid gap-4">
        {properties.map((p) => {
          const images: string[] = JSON.parse(p.images);
          return (
            <div key={p.id} className="bg-white rounded-3xl p-4 shadow-[var(--shadow-soft)] flex gap-4">
              <div className="relative h-32 w-44 rounded-2xl overflow-hidden shrink-0">
                <Image src={images[0]} alt={p.name} fill className="object-cover" sizes="200px" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-xl text-[var(--color-deep-900)]">{p.name}</h3>
                  {p.type === "villa" && <Badge tone="coral">Villa</Badge>}
                </div>
                <p className="text-sm text-[var(--color-deep-700)] line-clamp-2">{p.shortDescription}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-deep-700)]">
                  <span>{formatPrice(p.basePriceKes, "KES")}/night</span>
                  <span>· {p.bedrooms}br/{p.bathrooms}bath</span>
                  <span>· {images.length} photos</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/properties/${p.slug}` as any}><Pencil size={14} /> Edit</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/stays/${p.slug}`}><ExternalLink size={14} /> View</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
