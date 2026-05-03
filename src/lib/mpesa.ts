// Safaricom Daraja API integration — STK Push
// Docs: https://developer.safaricom.co.ke/Documentation
//
// Sandbox vs production: switch via MPESA_ENV=sandbox|production.
// All amounts are KES integers (no cents).

import axios from "axios";

const ENV = (process.env.MPESA_ENV as "sandbox" | "production") || "sandbox";

const BASE_URL = ENV === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const { data } = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in) * 1000,
  };
  return data.access_token;
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

/** Normalize a Kenyan phone number to 2547XXXXXXXX format. */
export function normalizeMsisdn(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;
  return digits;
}

export interface StkPushParams {
  phone: string;
  amountKes: number;
  reference: string;     // booking id, max 12 chars
  description: string;   // shown on phone, max 13 chars
  callbackUrl: string;
}

export interface StkPushResult {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export async function stkPush(p: StkPushParams): Promise<StkPushResult> {
  const token = await getAccessToken();
  const ts = timestamp();
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${ts}`).toString("base64");

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: ts,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.max(1, Math.round(p.amountKes)),
    PartyA: normalizeMsisdn(p.phone),
    PartyB: SHORTCODE,
    PhoneNumber: normalizeMsisdn(p.phone),
    CallBackURL: p.callbackUrl,
    AccountReference: p.reference.slice(0, 12),
    TransactionDesc: p.description.slice(0, 13),
  };

  const { data } = await axios.post(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data as StkPushResult;
}

/** Daraja sends back results to our callback. Helper to extract useful fields. */
export function parseCallback(body: any): {
  checkoutId: string;
  resultCode: number;
  resultDesc: string;
  amount?: number;
  receipt?: string;
  phone?: string;
  transactionDate?: string;
} {
  const stk = body?.Body?.stkCallback ?? {};
  const meta: { Name: string; Value: any }[] = stk?.CallbackMetadata?.Item ?? [];
  const get = (name: string) => meta.find((i) => i.Name === name)?.Value;
  return {
    checkoutId: stk.CheckoutRequestID,
    resultCode: Number(stk.ResultCode),
    resultDesc: stk.ResultDesc,
    amount: get("Amount"),
    receipt: get("MpesaReceiptNumber"),
    phone: get("PhoneNumber") ? String(get("PhoneNumber")) : undefined,
    transactionDate: get("TransactionDate") ? String(get("TransactionDate")) : undefined,
  };
}
