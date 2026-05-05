// Manual M-Pesa Paybill payment route — used as fallback (or primary, until
// Felister has her own Safaricom Daraja-registered paybill).
//
// Felister's setup: customers pay via M-Pesa "Lipa Na M-Pesa → Pay Bill",
// the funds land directly on her Equity Bank account.

export const MANUAL_PAYBILL = {
  /** Equity Bank's paybill number (used by anyone paying into Equity accounts). */
  paybillNumber: process.env.EQUITY_PAYBILL_NUMBER ?? "247247",
  /** Felister's Equity Bank account number — this is what M-Pesa uses as "Account". */
  accountNumber: process.env.EQUITY_ACCOUNT_NUMBER ?? "0250190915510",
  /** Bank + account holder name shown in the instructions for transparency. */
  bankName: process.env.EQUITY_BANK_NAME ?? "Equity Bank",
  accountHolder: process.env.EQUITY_ACCOUNT_HOLDER ?? "FELISTER M NDULI",
};

/** Whether automatic STK push is operational (production keys + Felister's own paybill). */
export function stkPushEnabled(): boolean {
  return process.env.MPESA_ENV === "production"
    && Boolean(process.env.MPESA_CONSUMER_KEY)
    && Boolean(process.env.MPESA_PASSKEY)
    && process.env.MPESA_SHORTCODE !== "174379"; // 174379 is Safaricom's sandbox shortcode
}
