import type { MetadataRoute } from "next";

const siteUrl = "https://daya-enterprises.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/#about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/#services`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/#projects`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/#process`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/#contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
