import { MetadataRoute } from "next";
import { sgkCodes } from "@/lib/sgk-codes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hakkimne.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/kidem-tazminati-hesaplama`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/issizlik-maasi-hesaplama`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bedelli-askerlik-ucreti-hesaplama`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fazla-mesai-ucreti-hesaplama`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sgk-cikis-kodlari`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic SGK code pages
  const sgkCodePages: MetadataRoute.Sitemap = sgkCodes.map((code) => ({
    url: `${baseUrl}/sgk-cikis-kodlari/${code.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...sgkCodePages];
}
