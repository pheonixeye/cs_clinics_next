import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.APP_URL && process.env.APP_URL !== "MY_APP_URL"
      ? process.env.APP_URL.replace(/\/$/, "")
      : "https://cs-clinics.pages.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
