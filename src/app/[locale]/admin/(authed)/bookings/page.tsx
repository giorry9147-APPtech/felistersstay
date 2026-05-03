import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminBookings() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: true },
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-[var(--color-deep-900)] mb-2">All bookings</h1>
      <p className="text-[var(--color-deep-700)] mb-8">Direct bookings made through felisterstays.com.</p>

      <div className="bg-white rounded-3xl p-6 shadow-[var(--shadow-soft)] overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="text-left text-xs uppercase tracking-wider text-[var(--color-deep-700)]">
            <tr><th className="py-2">Booked</th><th>Guest</th><th>Property</th><th>Stay</th><th>Total</th><th>Payment</th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-[var(--color-sand-200)]">
                <td className="py-3 text-xs text-[var(--color-deep-700)]">{new Date(b.createdAt).toLocaleDateString()}</td>
                <td>
                  <p className="font-medium">{b.guestName}</p>
                  <p className="text-xs text-[var(--color-deep-700)]">{b.guestEmail} · {b.guestPhone}</p>
                </td>
                <td>{b.property.name}</td>
                <td className="text-xs">
                  {new Date(b.checkIn).toLocaleDateString()} <br />→ {new Date(b.checkOut).toLocaleDateString()}<br />
                  <span className="text-[var(--color-deep-700)]">{b.nights} nights · {b.guests} guests</span>
                </td>
                <td className="font-semibold">{formatPrice(b.totalKes, "KES")}</td>
                <td>
                  <Badge tone={b.paymentStatus === "paid" ? "ocean" : b.paymentStatus === "failed" ? "coral" : "sand"}>
                    {b.paymentStatus}
                  </Badge>
                  {b.mpesaReceipt && <p className="text-xs text-[var(--color-deep-700)] mt-1">{b.mpesaReceipt}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-center text-sm text-[var(--color-deep-700)] py-8">No bookings yet.</p>}
      </div>
    </div>
  );
}
