import { redirect } from "next/navigation";
import { login, isAuthed } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

async function attemptLogin(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  const ok = await login(password);
  if (ok) redirect("/admin");
  redirect("/admin/login?error=1");
}

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAuthed()) redirect("/admin");
  const sp = await searchParams;
  return (
    <div className="container-x py-24 max-w-md mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-deep)]">
        <h1 className="font-display text-3xl text-[var(--color-deep-900)]">Admin sign in</h1>
        <p className="text-sm text-[var(--color-deep-700)] mt-1">Enter your admin password.</p>
        <form action={attemptLogin} className="mt-6 space-y-4">
          <Input type="password" name="password" placeholder="Password" required autoFocus />
          {sp.error && <p className="text-xs text-[var(--color-coral-700)]">Wrong password.</p>}
          <Button type="submit" variant="primary" size="lg" className="w-full">Sign in</Button>
        </form>
      </div>
    </div>
  );
}
