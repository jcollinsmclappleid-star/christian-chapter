import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const siteUrl = siteConfig.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/register/", "/admin/", "/api/", "/account", "/profile", "/sign-in", "/verify"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
