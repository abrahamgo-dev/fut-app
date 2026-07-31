import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel", "/reservar"],
    },
    sitemap: "https://once-fc.com/sitemap.xml",
  };
}
