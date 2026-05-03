import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "felister_admin";

function sign(payload: string): string {
  const secret = process.env.ADMIN_SECRET || "felister-dev-secret-change-me";
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function login(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD || "felister2026";
  if (password !== expected) return false;
  const value = `ok.${Date.now()}.${sign("ok")}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}

export async function isAuthed(): Promise<boolean> {
  const c = (await cookies()).get(COOKIE);
  if (!c) return false;
  const [tag, , sig] = c.value.split(".");
  if (tag !== "ok") return false;
  return sig === sign("ok");
}
