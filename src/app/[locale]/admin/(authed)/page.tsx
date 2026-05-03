import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, BedDouble, Banknote, Activity } from "lucide-react";

export default async function AdminDashboard() {
  const [propertyCount, bookingCount, paid, recent] = await Promise.all([
    db.property.count(),
    db.booking.count(),
    db.booking.aggregate({ _sum: { totalKes: true }, where: { paymentStatus: "paid" } }),
    db.booking.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { property: { select: { name: true, slug: true } } },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-4xl text-[var(--color-deep-900)] mb-8">Welcome back, Felister</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        <Stat icon={<BedDouble size={18} />} label="Properties" value={String(propertyCount)} />
        <Stat icon={<CalendarDays size={18} />} label="Total bookings" value={String(bookingCount)} />
        <Stat icon={<Banknote size={18} />} label="Revenue (paid)" value={formatPrice(paid._sum.totalKes ?? 0, "KES")} />
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-[var(--color-deep-900)]">Recent bookings</h2>
          <Activity size={16} className="text-[var(--color-deep-700)]" />
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-[var(--color-deep-700)]">No bookings yet. Once a guest reserves, they show up here.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-[var(--color-deep-700)]">
              <tr><th className="py-2">Guest</th><th>Property</th><th>Dates</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recent.map((b) => (
                <tr key={b.id} className="border-t border-[var(--color-sand-200)]">
                  <td className="py-3">
                    <p className="font-medium text-[var(--color-deep-900)]">{b.guestName}</p>
                    <p className="text-xs text-[var(--color-deep-700)]">{b.guestEmail}</p>
                  </td>
                  <td>{b.property.name}</td>
                  <td>{new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}</td>
                  <td>{formatPrice(b.totalKes, "KES")}</td>
                  <td>
                    <Badge tone={b.paymentStatus === "paid" ? "ocean" : b.paymentStatus === "failed" ? "coral" : "sand"}>
                      {b.paymentStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 text-[var(--color-deep-700)] text-xs uppercase tracking-wider font-semibold">{icon}{label}</div>
      <p className="font-display text-3xl text-[var(--color-deep-900)] mt-2">{value}</p>
    </div>
  );
}
