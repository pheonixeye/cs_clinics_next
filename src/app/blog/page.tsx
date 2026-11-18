import type { Metadata } from "next";
import { BlogIndexView } from "@/components/blog/blog-index-view";
import { getArticles } from "@/lib/pocketbase";
import { toAbsoluteUrl } from "@/lib/site";

// Article index is generated at build time from PocketBase, not per request.
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticles();
  const coverImage = toAbsoluteUrl(
    articles[0]?.coverImage || "/images/clinic_consultation_suite.jpg"
  );

  return {
    title: "Medical Journal & Health Articles",
    description:
      "Read specialist-authored medical guides on urology, dermatology, pediatrics, orthopedics, dentistry, and vascular care from CosmoSurge Clinics Cairo.",
    keywords: [
      "CosmoSurge Clinics",
      "medical articles Cairo",
      "health guides Maadi",
      "specialist-authored health journal",
    ],
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      title: "Medical Journal & Health Articles | CosmoSurge Clinics",
      description:
        "Evidence-based health guides authored by CosmoSurge Clinics specialists in Zahraa El Maadi.",
      url: "/blog",
      type: "website",
      locale: "ar_EG",
      alternateLocale: "en_US",
      images: [{ url: coverImage, alt: "CosmoSurge Clinics medical journal" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Medical Journal & Health Articles | CosmoSurge Clinics",
      description:
        "Evidence-based health guides authored by CosmoSurge Clinics specialists in Zahraa El Maadi.",
      images: [{ url: coverImage }],
    },
  };
}

export default async function BlogPage() {
  const articles = await getArticles();
  return <BlogIndexView articles={articles} />;
}
