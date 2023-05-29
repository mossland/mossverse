import { MetadataRoute } from "next";
import { env } from "@mossland/env/env";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `https://${env.origin}/sitemap.xml`,
  };
}
