"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { ClinicImage } from "@/components/ui/clinic-image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/clinic";

export function BlogIndexView({ articles }: { articles: Article[] }) {
  const { locale } = useApp();
  const isAr = locale === "ar";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const map = new Map<string, { en: string; ar: string }>();
    for (const art of articles) {
      map.set(art.category, { en: art.category, ar: art.category_a });
    }
    return Array.from(map.values());
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((art) => {
      const catMatch =
        selectedCategory === "all" || art.category === selectedCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        art.title.toLowerCase().includes(q) ||
        art.title_a.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.excerpt_a.toLowerCase().includes(q) ||
        art.authorName.toLowerCase().includes(q)
      );
    });
  }, [articles, selectedCategory, query]);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
          {isAr ? "المجلة الطبية لعيادات كوزموسيرج" : "CosmoSurge Medical Journal"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {isAr
            ? "مقالات طبية موثقة وإرشادات للمرضى"
            : "Evidence-Based Health Articles & Patient Guides"}
        </h1>
        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {isAr
            ? "أدلة توعوية مكتوبة ومراجعة من أطبائنا المتخصصين في زهراء المعادي لمساعدتك على اتخاذ قرارات صحية مدروسة."
            : "Written and reviewed by CosmoSurge specialists in Zahraa El Maadi to help patients prepare for consultations and preventive care."}
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isAr ? "ابحث في المقالات الطبية..." : "Search health articles..."
            }
            className="ps-10"
            aria-label={isAr ? "بحث المقالات" : "Search articles"}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer",
              selectedCategory === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            {isAr ? "كل المقالات" : "All Topics"}
          </button>
          {categories.map((cat) => {
            const active = selectedCategory === cat.en;
            return (
              <button
                key={cat.en}
                type="button"
                onClick={() => setSelectedCategory(cat.en)}
                className={cn(
                  "min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer",
                  active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
              >
                {isAr ? cat.ar : cat.en}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {isAr ? "لا توجد مقالات مطابقة للبحث." : "No articles match your search."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <Link
                href={`/blog/${article.slug}`}
                className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800"
              >
                <ClinicImage
                  src={article.coverImage}
                  alt={article.coverAlt}
                  className="transition-transform duration-300 group-hover:scale-[1.02]"
                  fallbackTitle={article.title}
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-teal-700 dark:text-teal-400">
                      {isAr ? article.category_a : article.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.publishedAt} className="font-mono-tabular">
                      {article.publishedAt}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">
                      {article.readTimeMinutes} {isAr ? "دقائق" : "min read"}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold leading-snug text-slate-900 dark:text-white">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="hover:text-teal-700 dark:hover:text-teal-400"
                    >
                      {isAr ? article.title_a : article.title}
                    </Link>
                  </h2>

                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {isAr ? article.excerpt_a : article.excerpt}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">
                    {isAr ? article.authorName_a : article.authorName}
                  </span>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="font-semibold text-teal-700 hover:underline dark:text-teal-400"
                  >
                    {isAr ? "اقرأ المقال" : "Read Guide"}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
