import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { business, telHref } from "@/lib/business";
import logoStacked from "@/public/brand/logo-stacked.png";

export const metadata: Metadata = {
  title: "Page not found | Golden Bite",
  robots: { index: false },
};

export default function NotFound() {
  const phone = business.phones[0];
  return (
    <main className="not-found">
      <Image src={logoStacked} alt="Golden Bite" width={160} priority />
      <p className="eyebrow">Page not found</p>
      <h1>
        This plate is <em>empty.</em>
      </h1>
      <p>The page you’re looking for doesn’t exist, but the menu does.</p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/#menu">
          See the menu
        </Link>
        <a className="button button-quiet" href={telHref(phone)}>
          Call {phone.display}
        </a>
      </div>
    </main>
  );
}
