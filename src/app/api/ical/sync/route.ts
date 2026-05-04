import { NextResponse } from "next/server";
import { syncAllProperties } from "@/lib/ical";

// Trigger via:
//   • Vercel cron — auto-sends `Authorization: Bearer ${CRON_SECRET}` (set automatically)
//   • Manual / external — GET /api/ical/sync?token=<SYNC_TOKEN env var>
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const auth = req.headers.get("authorization") ?? "";
  const expectedToken = process.env.SYNC_TOKEN;
  const cronSecret = process.env.CRON_SECRET;

  const fromCron = cronSecret && auth === `Bearer ${cronSecret}`;
  const fromTokenAuth = expectedToken && token === expectedToken;
  const noAuthConfigured = !cronSecret && !expectedToken;

  if (!fromCron && !fromTokenAuth && !noAuthConfigured) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await syncAllProperties();
  return NextResponse.json({ ok: true, results, syncedAt: new Date().toISOString() });
}

export const dynamic = "force-dynamic";
