import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Felister Stays · Coastal homes in Mtwapa, Kenya",
  description:
    "A handpicked collection of three coastal homes on Kenya's Indian Ocean coast — book direct, pay with M-Pesa, save vs. Airbnb.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
