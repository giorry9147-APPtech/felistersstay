import { NextResponse } from "next/server";
import { syncAllProperties } from "@/lib/ical";

// Trigger via cron: GET /api/ical/sync (with optional ?token=... env-protected)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const expected = process.env.SYNC_TOKEN;
  if (expected && token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await syncAllProperties();
  return NextResponse.json({ ok: true, results, syncedAt: new Date().toISOString() });
}

export const dynamic = "force-dynamic";
