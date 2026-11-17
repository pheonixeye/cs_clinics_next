"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { ClinicImage } from "@/components/ui/clinic-image";
import type { Article } from "@/types/clinic";

export function BlogArticleView({
  article,
  relatedArticles,
}: {
  article: Article;
  relatedArticles: Article[];
}) {
  const { locale, openBooking } = useApp();
  const isAr = locale === "ar";

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-400"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        <span>{isAr ? "كل المقالات الطبية" : "Back to Medical Journal"}</span>
      </Link>

      <header className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-teal-700 dark:text-teal-400">
            {isAr ? article.category_a : article.category}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.publishedAt} className="font-mono-tabular">
            {article.publishedAt}
          </time>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular">
            {article.readTimeMinutes} {isAr ? "دقائق قراءة" : "min read"}
          </span>
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {isAr ? article.title_a : article.title}
        </h1>

        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          {isAr ? article.excerpt_a : article.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4 dark:border-slate-800">
          <div>
            <Link
              href={`/doctors/${article.authorId}`}
              className="text-sm font-semibold text-slate-900 hover:text-teal-700 dark:text-white dark:hover:text-teal-400"
            >
              {isAr ? article.authorName_a : article.authorName}
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? article.authorTitle_a : article.authorTitle}
            </p>
          </div>

          <Button size="sm" onClick={() => openBooking(article.authorId)}>
            <Calendar className="h-4 w-4" />
            <span>
              {isAr
                ? `احجز مع ${article.authorName_a}`
                : `Book with ${article.authorName}`}
            </span>
          </Button>
        </div>
      </header>

      <div className="my-8 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        <ClinicImage
          src={article.coverImage}
          alt={article.coverAlt}
          fallbackTitle={article.title}
        />
      </div>

      {/* Article Body */}
      <div className="mx-auto max-w-[68ch] space-y-8">
        {article.sections.map((section, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {isAr ? section.heading_a : section.heading}
            </h2>
            {(isAr ? section.paragraphs_a : section.paragraphs).map((p, pIdx) => (
              <p
                key={pIdx}
                className="text-base leading-[1.75] text-slate-700 dark:text-slate-300"
              >
                {p}
              </p>
            ))}
          </section>
        ))}

        {/* FAQs */}
        {article.faqs.length > 0 && (
          <section className="space-y-4 border-t border-slate-200 pt-8 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? "أسئلة شائعة" : "Frequently Asked Questions"}
            </h2>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {article.faqs.map((faq, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {isAr ? faq.question_a : faq.question}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {isAr ? faq.answer_a : faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Specialist Consultation CTA */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {isAr
                  ? `هل تحتاج لاستشارة ${article.authorName_a}؟`
                  : `Need an evaluation with ${article.authorName}?`}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isAr
                  ? "احجز موعدك في فرع زهراء المعادي مع تأكيد فوري برسالة نصية."
                  : "Schedule directly at our Zahraa El Maadi clinic with instant SMS confirmation."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Button size="sm" onClick={() => openBooking(article.authorId)}>
                {isAr ? "احجز الآن" : "Book Consultation"}
              </Button>
              <Link
                href={`/doctors/${article.authorId}`}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {isAr ? "ملف الطبيب" : "View Schedule"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-800">
          <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? "مقالات طبية أخرى" : "More from the Medical Journal"}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={`/blog/${rel.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                  {isAr ? rel.category_a : rel.category}
                </p>
                <h3 className="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">
                  {isAr ? rel.title_a : rel.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                  {isAr ? rel.excerpt_a : rel.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
