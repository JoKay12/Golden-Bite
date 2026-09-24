/**
 * Single source of truth for Golden Bite's business details.
 * Change a number or the hours here and the whole site updates.
 */

export type Phone = {
  /** How the number is shown to customers. */
  display: string;
  /** International format for tel: and wa.me links (no "+"). */
  international: string;
};

export const business = {
  name: "Golden Bite",
  tagline: "Satisfy your hunger",
  address: {
    street: "Ohene Ameyaw Park",
    locality: "Techiman",
    region: "Bono East",
    country: "GH",
  },
  phones: [
    { display: "054 240 3077", international: "233542403077" },
    { display: "020 663 7359", international: "233206637359" },
  ] satisfies Phone[],
  whatsapp: { display: "054 240 3077", international: "233542403077" } satisfies Phone,
  momo: {
    network: "MTN Mobile Money",
    number: "054 240 3077",
    /**
     * TODO(owner): the name registered on the MoMo wallet, e.g. "Golden Bite Enterprise".
     * When set, it is shown on the payment card so customers can check it before paying.
     */
    accountName: null as string | null,
  },
  /** Opening hours in Africa/Accra time. 0 = Sunday … 6 = Saturday. */
  hours: {
    timeZone: "Africa/Accra",
    days: [1, 2, 3, 4, 5, 6],
    opensAt: 11,
    closesAt: 22,
    label: "Monday–Saturday · 11 AM–10 PM",
    shortDays: "Mon–Sat",
    shortTime: "11 AM–10 PM",
  },
  deliveryArea: "Techiman",
  /** Shown until a fixed fee structure is agreed with the owner. */
  deliveryFeeNote:
    "Delivery fee depends on your location in Techiman and is confirmed on WhatsApp.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const telHref = (phone: Phone) => `tel:+${phone.international}`;

export const whatsappHref = (message: string) =>
  `https://wa.me/${business.whatsapp.international}?text=${encodeURIComponent(message)}`;
