import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleView } from "@/components/blog/blog-article-view";
import { CLINIC_INFO } from "@/data/clinic-info";
import { getArticleBySlugAsync, getArticles } from "@/lib/pocketbase";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site";

// Every article page is generated at build time from PocketBase and served as
// static HTML. No backend request happens when a visitor opens the page.
export const dynamic = "force-static";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlugAsync(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  // The default UI locale is Arabic, so the crawled title/description match
  // the server-rendered content; English values remain available as alternates.
  const title = article.title_a || article.title;
  const description = article.excerpt_a || article.excerpt;
  const author = article.authorName_a || article.authorName;
  const coverImage = toAbsoluteUrl(article.coverImage);

  return {
    title,
    description,
    keywords: article.keywords,
    authors: [{ name: author }],
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      type: "article",
      url: `/blog/${article.slug}`,
      siteName: CLINIC_INFO.brandName,
      locale: "ar_EG",
      alternateLocale: "en_US",
      title,
      description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [author],
      tags: article.keywords,
      images: [{ url: coverImage, alt: article.coverAlt || title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: coverImage, alt: article.coverAlt || title }],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([
    getArticleBySlugAsync(slug),
    getArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/blog/${article.slug}`;
  const authorUrl = `${siteUrl}/doctors/${article.authorId}`;
  const title = article.title_a || article.title;
  const description = article.excerpt_a || article.excerpt;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    headline: title,
    alternativeHeadline: article.title,
    description,
    inLanguage: ["ar", "en"],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    image: toAbsoluteUrl(article.coverImage),
    mainEntityOfPage: canonicalUrl,
    keywords: article.keywords.join(", "),
    author: {
      "@type": "Physician",
      "@id": authorUrl,
      name: article.authorName_a || article.authorName,
      alternateName: article.authorName,
      jobTitle: article.authorTitle_a || article.authorTitle,
      url: authorUrl,
    },
    publisher: {
      "@type": "MedicalClinic",
      name: CLINIC_INFO.brandName,
      url: siteUrl,
      address: CLINIC_INFO.address,
    },
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question_a || faq.question,
      alternateName: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer_a || faq.answer,
      },
    })),
  };

  const jsonLd = JSON.stringify(articleJsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <BlogArticleView article={article} relatedArticles={relatedArticles} />
    </>
  );
}
