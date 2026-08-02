import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel", "/reservar", "/checkout"],
    },
    sitemap: "https://www.once-fc.com/sitemap.xml",
  };
}
