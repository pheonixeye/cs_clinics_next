"use client";

import React from "react";
import Link from "next/link";
import { CLINIC_INFO } from "@/data/clinic-info";
import { useApp } from "@/components/providers/app-provider";

export function SiteFooter() {
  const { locale, theme, toggleTheme, toggleLocale } = useApp();
  const isAr = locale === "ar";

  return (
    <footer className="border-t border-slate-200 bg-slate-50 pb-24 pt-12 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {isAr ? CLINIC_INFO.brandNameAr : CLINIC_INFO.brandName}
            </p>
            <p className="text-sm leading-relaxed">
              {isAr ? CLINIC_INFO.addressAr : CLINIC_INFO.address}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? CLINIC_INFO.openingHoursAr : CLINIC_INFO.openingHours}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isAr ? "الأقسام" : "Explore"}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/doctors"
                  className="hover:text-teal-700 dark:hover:text-teal-400"
                >
                  {isAr ? "أطباؤنا والتخصصات" : "Our Doctors & Specialties"}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-teal-700 dark:hover:text-teal-400"
                >
                  {isAr ? "المقالات الطبية" : "Medical Journal"}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-teal-700 dark:hover:text-teal-400"
                >
                  {isAr ? "الموقع وساعات العمل" : "Location & Hours"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isAr ? "تواصل معنا" : "Direct Contact"}
            </p>
            <ul className="space-y-2 text-sm font-mono-tabular">
              <li>
                <a
                  href={CLINIC_INFO.landlineHref}
                  className="hover:text-teal-700 dark:hover:text-teal-400"
                >
                  {isAr ? `أرضي: ${CLINIC_INFO.landline}` : `Tel: ${CLINIC_INFO.landline}`}
                </a>
              </li>
              <li>
                <a
                  href={CLINIC_INFO.mobileHref}
                  className="hover:text-teal-700 dark:hover:text-teal-400"
                >
                  {isAr ? `موبايل: ${CLINIC_INFO.mobile}` : `Mobile: ${CLINIC_INFO.mobile}`}
                </a>
              </li>
              <li>
                <a
                  href={CLINIC_INFO.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-700 dark:hover:text-teal-400 font-sans"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={CLINIC_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-700 dark:hover:text-teal-400 font-sans"
                >
                  {isAr ? "الاتجاهات على خرائط جوجل" : "Get Directions"}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isAr ? "تابعنا والتطبيق" : "Connect & App"}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={CLINIC_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-700 dark:hover:text-teal-400"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={CLINIC_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-700 dark:hover:text-teal-400"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={CLINIC_INFO.socials.playstore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-700 dark:hover:text-teal-400"
                >
                  {isAr ? "تطبيق الأندرويد" : "Google Play App"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} CosmoSurge Clinics Medical Center.{" "}
            {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="font-medium text-slate-700 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400 cursor-pointer"
            >
              {theme === "dark"
                ? isAr
                  ? "الوضع الفاتح"
                  : "Light Mode"
                : isAr
                  ? "الوضع الداكن"
                  : "Dark Mode"}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={toggleLocale}
              className="font-medium text-slate-700 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400 cursor-pointer"
            >
              {isAr ? "English" : "العربية"}
            </button>
            <span aria-hidden="true">·</span>
            <span>
              {isAr
                ? "زهراء المعادي، القاهرة"
                : "Zahraa El Maadi, Cairo"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
