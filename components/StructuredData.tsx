import { business } from "@/lib/business";
import { menu } from "@/lib/menu";

/** schema.org Restaurant data so Google can show hours, phone, address and menu. */
export function StructuredData() {
  const { hours } = business;
  const pad = (h: number) => `${String(h).padStart(2, "0")}:00`;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    url: business.siteUrl,
    image: `${business.siteUrl}/opengraph-image.jpg`,
    telephone: business.phones.map((p) => `+${p.international}`),
    servesCuisine: ["Ghanaian", "Fast food"],
    priceRange: "GH₵5–GH₵600",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.days.map((d) => dayNames[d]),
        opens: pad(hours.opensAt),
        closes: pad(hours.closesAt),
      },
    ],
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: menu.map((family) => ({
        "@type": "MenuSection",
        name: family.name,
        hasMenuItem: family.items.map((item) => ({
          "@type": "MenuItem",
          name: item.name,
          description: item.description,
          offers: item.prices.map((price) => ({
            "@type": "Offer",
            price,
            priceCurrency: "GHS",
          })),
        })),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: all values come from our own config, and "<" is escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
