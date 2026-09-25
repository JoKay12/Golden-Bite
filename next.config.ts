import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

/** This computer's own network addresses, e.g. 192.168.1.20 on home Wi-Fi. */
const localAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net && net.family === "IPv4" && !net.internal)
  .map((net) => net!.address);

const nextConfig: NextConfig = {
  /**
   * `npm run dev` only serves its JavaScript to http://localhost by default. Opening the site as
   * http://127.0.0.1:3000, or from a phone on the same Wi-Fi (http://192.168.x.x:3000), would load
   * the page but leave every button dead. This allows those addresses. Development only: it has no
   * effect on the live site.
   */
  allowedDevOrigins: ["127.0.0.1", ...localAddresses],
};

export default nextConfig;
