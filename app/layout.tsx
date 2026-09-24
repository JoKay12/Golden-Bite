import type { Metadata, Viewport } from "next";
import { business } from "@/lib/business";
import "./globals.css";

const description =
  "Order jollof, fried rice, banku & tilapia and more from Golden Bite for pickup or delivery in Techiman. Open Monday–Saturday, 11 AM–10 PM.";

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: "Golden Bite | Satisfy Your Hunger · Techiman",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: business.name,
    title: "Golden Bite · Satisfy your hunger",
    description,
  },
  twitter: { card: "summary_large_image", title: "Golden Bite · Satisfy your hunger", description },
};

export const viewport: Viewport = {
  themeColor: "#100d09",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GH">
      <body>{children}</body>
    </html>
  );
}
