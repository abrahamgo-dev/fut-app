import { MetadataRoute } from "next";
import { getActiveCities } from "@/data/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://once-fc.com";
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/ciudades`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/preguntas-frecuentes`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...getActiveCities().map((city) => ({
      url: `${siteUrl}/ciudades/${city.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
