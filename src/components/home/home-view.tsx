"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { DoctorsDirectory } from "@/components/doctors/doctors-directory";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { ClinicImage } from "@/components/ui/clinic-image";
import { CLINIC_INFO } from "@/data/clinic-info";
import type { Article, Doctor } from "@/types/clinic";

interface HomeViewProps {
  doctors: Doctor[];
  articles: Article[];
}

export function HomeView({ doctors, articles }: HomeViewProps) {
  const { locale, openBooking } = useApp();
  const isAr = locale === "ar";

  return (
    <div className="space-y-20 pb-16 sm:space-y-24 sm:pb-24">
      {/* 1. Hero Split */}
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-12">
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col justify-center space-y-6 lg:col-span-6">
            <p className="text-xs font-medium tracking-wide text-teal-700 dark:text-teal-400">
              {isAr
                ? `${CLINIC_INFO.branchNameAr} · زهراء المعادي، القاهرة`
                : `${CLINIC_INFO.branchName} · Zahraa El Maadi, Cairo`}
            </p>

            <h1 className="text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
              {isAr
                ? "رعاية طبية متخصصة ومتكاملة في مكان واحد"
                : "Coordinated Specialist Care Under One Roof"}
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {isAr ? CLINIC_INFO.aboutSummaryAr : CLINIC_INFO.aboutSummary}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button size="lg" onClick={() => openBooking()}>
                {isAr ? "احجز موعدك الآن" : "Book Appointment"}
              </Button>
              <a
                href={CLINIC_INFO.landlineHref}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 font-mono-tabular whitespace-nowrap shrink-0"
              >
                <Phone className="h-4 w-4 text-teal-700 dark:text-teal-400" />
                <span>{CLINIC_INFO.landline}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 lg:aspect-auto lg:h-full lg:min-h-[400px]">
              <ClinicImage
                src="/images/hero_clinic_interior.jpg"
                alt={
                  isAr
                    ? "استقبال عيادات كوزموسيرج في زهراء المعادي"
                    : "CosmoSurge Clinics reception lounge in Zahraa El Maadi, Cairo"
                }
                fallbackTitle="CosmoSurge Clinics"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-column clinic facts strip */}
        <div className="mt-10 grid grid-cols-2 gap-4 border-y border-slate-200 py-6 dark:border-slate-800 lg:grid-cols-4 lg:gap-8">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? "التخصصات الطبية" : "Clinical Specialties"}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white font-mono-tabular">
              {isAr ? `${doctors.length} تخصصات` : `${doctors.length} Specialties`}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? "ساعات العمل" : "Opening Hours"}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white font-mono-tabular">
              {isAr ? "٤:٠٠ م – ١٠:٠٠ م" : "4:00 PM – 10:00 PM"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? "أيام العمل" : "Clinic Days"}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              {isAr ? "السبت – الخميس" : "Sat – Thu"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? "تأكيد الحجز" : "Confirmations"}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              {isAr ? "رسالة نصية SMS" : "Instant SMS"}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Find a Specialist */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {isAr ? "اختر طبيبك المتخصص" : "Find a Specialist"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              {isAr
                ? "استعرض المواعيد الأسبوعية واحجز كشفك مباشرة عبر الإنترنت."
                : "Browse weekly schedules across ten medical and surgical clinics."}
            </p>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 whitespace-nowrap shrink-0"
          >
            <span>{isAr ? "عرض كل الأطباء" : "View All Doctors"}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <DoctorsDirectory doctors={doctors} />
      </section>

      {/* 3. What Makes Care at CosmoSurge Different */}
      <section
        id="why-cosmosurge"
        className="mx-auto max-w-6xl px-4 sm:px-6"
      >
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 lg:aspect-auto lg:h-full lg:min-h-[380px]">
              <ClinicImage
                src="/images/clinic_consultation_suite.jpg"
                alt={
                  isAr
                    ? "غرفة الاستشارات الطبية في عيادات كوزموسيرج"
                    : "Specialist medical consultation suite at CosmoSurge Clinics"
                }
                fallbackTitle="Specialist Consultation Suite"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8 lg:col-span-7">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {isAr
                  ? "ما الذي يميز الرعاية في عيادات كوزموسيرج؟"
                  : "What makes care at CosmoSurge Clinics different?"}
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                {isAr
                  ? "ما يجعلنا أفضل ينعكس مباشرة على صحتك وراحتك."
                  : "What makes us better makes your recovery faster and clearer."}
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {CLINIC_INFO.differentiators.map((item) => (
                <div key={item.index} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                    <span className="me-2 font-mono-tabular text-teal-700 dark:text-teal-400">
                      {item.index}.
                    </span>
                    {isAr ? item.titleAr : item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {isAr ? item.descriptionAr : item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEO Medical Journal Preview */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {isAr ? "المجلة الطبية والمقالات التوعوية" : "Medical Journal & Patient Guides"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              {isAr
                ? "مقالات طبية موثقة من أطباء كوزموسيرج لمساعدتك على فهم حالتك."
                : "Evidence-based health guides written by our Cairo clinic specialists."}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 whitespace-nowrap shrink-0"
          >
            <span>{isAr ? "جميع المقالات" : "Read All Articles"}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <Link href={`/blog/${article.slug}`} className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
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
                    <span className="font-mono-tabular">
                      {article.readTimeMinutes} {isAr ? "دقائق قراءة" : "min read"}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold leading-snug text-slate-900 dark:text-white">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="hover:text-teal-700 dark:hover:text-teal-400"
                    >
                      {isAr ? article.title_a : article.title}
                    </Link>
                  </h3>

                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {isAr ? article.excerpt_a : article.excerpt}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  {isAr ? article.authorName_a : article.authorName}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Visit Our Maadi Branch CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              {isAr ? "زيارة فرع زهراء المعادي" : "Visit Our Zahraa El Maadi Clinic"}
            </h2>
            <p className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
              <span>{isAr ? CLINIC_INFO.addressAr : CLINIC_INFO.address}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? CLINIC_INFO.openingHoursAr : CLINIC_INFO.openingHours}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={CLINIC_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
            >
              {isAr ? "الحصول على الاتجاهات" : "Get Directions"}
            </a>
            <Button size="md" onClick={() => openBooking()}>
              {isAr ? "احجز موعدك" : "Book Appointment"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
