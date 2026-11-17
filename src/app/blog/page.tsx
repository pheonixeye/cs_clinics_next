import type { Metadata } from "next";
import { BlogIndexView } from "@/components/blog/blog-index-view";
import { getArticles } from "@/lib/pocketbase";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Medical Journal & Health Articles",
  description:
    "Read specialist-authored medical guides on urology, dermatology, pediatrics, orthopedics, dentistry, and vascular care from CosmoSurge Clinics Cairo.",
  openGraph: {
    title: "Medical Journal & Health Articles | CosmoSurge Clinics",
    description:
      "Evidence-based health guides authored by CosmoSurge Clinics specialists in Zahraa El Maadi.",
    type: "website",
  },
};

export default async function BlogPage() {
  const articles = await getArticles();
  return <BlogIndexView articles={articles} />;
}
