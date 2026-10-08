import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

if (isProd && !process.env.NEXT_PUBLIC_SITE_URL && !process.env.CI) {
  console.warn(
    "\n⚠  NEXT_PUBLIC_SITE_URL is not set: canonical, sitemap and social-preview links will point to localhost.\n" +
      "   Set it to the live address (e.g. https://goldenbite.com.gh) in your hosting settings.\n",
  );
}

/** This computer's own network addresses, e.g. 192.168.1.20 on home Wi-Fi. */
const localAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net && net.family === "IPv4" && !net.internal)
  .map((net) => net!.address);

/**
 * Content Security Policy. The site only loads its own files; WhatsApp and phone links are plain
 * links, not loaded content. Next.js needs inline scripts for hydration (and eval + websockets in
 * development only).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isProd ? "" : " ws: wss:"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Browsers only honour this over HTTPS, so it is harmless on localhost.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /**
   * `npm run dev` only serves its JavaScript to http://localhost by default. Opening the site as
   * http://127.0.0.1:3000, or from a phone on the same Wi-Fi (http://192.168.x.x:3000), would load
   * the page but leave every button dead. This allows those addresses. Development only: it has no
   * effect on the live site. Only run the dev server on Wi-Fi you trust.
   */
  allowedDevOrigins: ["127.0.0.1", ...localAddresses],
};

export default nextConfig;
