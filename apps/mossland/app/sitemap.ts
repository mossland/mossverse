import { MetadataRoute } from "next";
import { env } from "@mossland/env/env";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `https://${env.origin}`, lastModified: new Date() },
    { url: `https://${env.origin}/map`, lastModified: new Date() },
    { url: `https://${env.origin}/listing`, lastModified: new Date() },
    { url: `https://${env.origin}/survey`, lastModified: new Date() },
    { url: `https://${env.origin}/trade`, lastModified: new Date() },
    { url: `https://${env.origin}/character`, lastModified: new Date() },
    { url: `https://${env.origin}/raffle`, lastModified: new Date() },
    { url: `https://${env.origin}/stakePool`, lastModified: new Date() },
    { url: `https://${env.origin}/groupCall`, lastModified: new Date() },
  ];
}
