import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { VerifyButtons } from "./verify-buttons";

export default async function AdminBookings() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: true },
  });

  const awaiting = bookings.filter((b) => b.paymentStatus === "awaiting_verification");
  const others = bookings.filter((b) => b.paymentStatus !== "awaiting_verification");

  return (
    <div>
      <h1 className="font-display text-4xl text-[var(--color-deep-900)] mb-2">All bookings</h1>
      <p className="text-[var(--color-deep-700)] mb-8">Direct bookings made through felisterstays.com.</p>

      {awaiting.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-display text-xl text-[var(--color-coral-700)]">⏳ Awaiting verification</h2>
            <Badge tone="coral">{awaiting.length}</Badge>
          </div>
          <p className="text-sm text-[var(--color-deep-700)] mb-4">
            Verify each M-Pesa code below by checking your Equity Bank statement.
            Look for a deposit matching the amount and the customer's name.
          </p>
          <div className="space-y-3">
            {awaiting.map((b) => (
              <article key={b.id} className="bg-white rounded-3xl p-5 shadow-[var(--shadow-soft)] border-l-4 border-[var(--color-coral-500)]">
                <div className="grid md:grid-cols-[2fr_2fr_1.5fr_auto] gap-4 items-start">
                  <div>
                    <p className="font-display text-lg text-[var(--color-deep-900)]">{b.guestName}</p>
                    <p className="text-xs text-[var(--color-deep-700)]">{b.guestEmail}</p>
                    <p className="text-xs text-[var(--color-deep-700)]">{b.guestPhone}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-[var(--color-deep-900)]">{b.property.name}</p>
                    <p className="text-xs text-[var(--color-deep-700)]">
                      {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-[var(--color-deep-700)]">{b.nights} nights · {b.guests} guests</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-deep-700)] font-semibold">M-Pesa code</p>
                    <p className="font-mono font-semibold tracking-wider text-[var(--color-deep-900)]">{b.mpesaReceipt}</p>
                    <p className="font-display text-lg text-[var(--color-deep-900)] mt-1 price">{formatPrice(b.totalKes, "KES")}</p>
                  </div>
                  <VerifyButtons bookingId={b.id} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl text-[var(--color-deep-900)] mb-3">All bookings</h2>
        <div className="bg-white rounded-3xl p-6 shadow-[var(--shadow-soft)] overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="text-left text-xs uppercase tracking-wider text-[var(--color-deep-700)]">
              <tr><th className="py-2">Booked</th><th>Guest</th><th>Property</th><th>Stay</th><th>Total</th><th>Method</th><th>Payment</th></tr>
            </thead>
            <tbody>
              {others.map((b) => (
                <tr key={b.id} className="border-t border-[var(--color-sand-200)]">
                  <td className="py-3 text-xs text-[var(--color-deep-700)]">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td>
                    <p className="font-medium">{b.guestName}</p>
                    <p className="text-xs text-[var(--color-deep-700)]">{b.guestEmail}</p>
                  </td>
                  <td>{b.property.name}</td>
                  <td className="text-xs">
                    {new Date(b.checkIn).toLocaleDateString()} <br />→ {new Date(b.checkOut).toLocaleDateString()}<br />
                    <span className="text-[var(--color-deep-700)]">{b.nights} nights · {b.guests} guests</span>
                  </td>
                  <td className="font-semibold price">{formatPrice(b.totalKes, "KES")}</td>
                  <td className="text-xs text-[var(--color-deep-700)]">{b.paymentMethod}</td>
                  <td>
                    <Badge tone={b.paymentStatus === "paid" ? "ocean" : b.paymentStatus === "failed" ? "coral" : "sand"}>
                      {b.paymentStatus}
                    </Badge>
                    {b.mpesaReceipt && <p className="text-xs text-[var(--color-deep-700)] mt-1 font-mono">{b.mpesaReceipt}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {others.length === 0 && <p className="text-center text-sm text-[var(--color-deep-700)] py-8">No completed bookings yet.</p>}
        </div>
      </section>
    </div>
  );
}
