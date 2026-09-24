import type { MetadataRoute } from "next";
import { business } from "@/lib/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: business.siteUrl, changeFrequency: "weekly", priority: 1 }];
}
