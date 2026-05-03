import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { Link } from "@/i18n/routing";
import { LayoutDashboard, CalendarDays, Building, RefreshCw, LogOut } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAuthed();
  if (!ok) redirect("/admin/login");

  return (
    <div className="min-h-[80vh] container-x py-12 grid gap-8 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <div className="sticky top-28 bg-white rounded-3xl p-4 shadow-[var(--shadow-soft)]">
          <p className="px-3 py-2 text-xs uppercase tracking-wider text-[var(--color-deep-700)] font-semibold">Felister admin</p>
          <nav className="flex flex-col gap-1 mt-2">
            <NavLink href="/admin" icon={<LayoutDashboard size={16} />}>Dashboard</NavLink>
            <NavLink href="/admin/bookings" icon={<CalendarDays size={16} />}>Bookings</NavLink>
            <NavLink href="/admin/properties" icon={<Building size={16} />}>Properties</NavLink>
            <NavLink href="/admin/sync" icon={<RefreshCw size={16} />}>Calendar sync</NavLink>
          </nav>
          <form action="/api/admin/logout" method="post" className="mt-4 pt-4 border-t border-[var(--color-sand-200)]">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-deep-700)] hover:text-[var(--color-deep-900)] w-full">
              <LogOut size={16} /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <section className="lg:col-span-9">{children}</section>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href as any} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-[var(--color-sand-100)]">
      {icon} {children}
    </Link>
  );
}
