"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Phone } from "lucide-react";
import { BookingWidget } from "@/components/booking/booking-widget";
import { DoctorAvatar } from "@/components/doctors/doctor-avatar";
import { useApp } from "@/components/providers/app-provider";
import { CLINIC_INFO } from "@/data/clinic-info";
import {
  formatClinicHour,
  translateDay,
} from "@/data/doctors";
import type { Article, Doctor } from "@/types/clinic";

interface DoctorProfileViewProps {
  doctor: Doctor;
  allDoctors: Doctor[];
  relatedArticles: Article[];
}

export function DoctorProfileView({
  doctor,
  allDoctors,
  relatedArticles,
}: DoctorProfileViewProps) {
  const { locale } = useApp();
  const isAr = locale === "ar";

  const displayName = isAr ? `د. ${doctor.docname_a}` : `Dr. ${doctor.docname}`;
  const displayClinic = isAr ? doctor.clinic_a : doctor.clinic;
  const titles = isAr ? doctor.titles_a : doctor.titles;
  const affiliates = isAr ? doctor.affiliates_a : doctor.affiliates;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/doctors"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-400"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        <span>{isAr ? "العودة إلى قائمة الأطباء" : "All Specialists"}</span>
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left column: Doctor Info & Weekly Clinic Schedule */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <DoctorAvatar
                doctorId={doctor._id}
                name={doctor.docname}
                alt={displayName}
                size="profile"
              />
              <div className="space-y-1">
                <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                  {displayClinic}
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {displayName}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? CLINIC_INFO.branchNameAr : CLINIC_INFO.branchName} ·{" "}
                  {isAr ? "زهراء المعادي" : "Zahraa El Maadi"}
                </p>
              </div>
            </div>

            {titles.length > 0 && (
              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {isAr ? "المؤهلات والدرجة العلمية" : "Credentials & Titles"}
                </h2>
                <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                  {titles.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
              <h2 className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>{isAr ? "مواعيد العيادة الأسبوعية" : "Weekly Clinic Hours"}</span>
              </h2>
              <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                {doctor.schedule.map((slot) => (
                  <div
                    key={`${slot.day}-${slot.start}`}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {translateDay(slot.day, locale)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono-tabular">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formatClinicHour(slot.start, locale)} –{" "}
                      {formatClinicHour(slot.end, locale)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {affiliates.length > 0 && (
              <div className="mt-6 border-t border-slate-100 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {isAr ? "طرق الحجز المتاحة: " : "Accepted Channels: "}
                </span>
                <span>{affiliates.join(" · ")}</span>
              </div>
            )}

            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
              <a
                href={`tel:+2${doctor.phone_ass || CLINIC_INFO.mobile}`}
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-400 font-mono-tabular"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>
                  {isAr ? "استقبال العيادة: " : "Clinic Desk: "}
                  {doctor.phone_ass || CLINIC_INFO.mobile}
                </span>
              </a>
            </div>
          </div>

          {relatedArticles.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {isAr ? "مقالات طبية ذات صلة" : "Related Patient Guides"}
              </h2>
              <ul className="mt-3 space-y-3">
                {relatedArticles.map((art) => (
                  <li key={art.slug}>
                    <Link
                      href={`/blog/${art.slug}`}
                      className="block text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
                    >
                      {isAr ? art.title_a : art.title}
                    </Link>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-tabular">
                      {art.readTimeMinutes} {isAr ? "دقائق قراءة" : "min read"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column: Interactive Booking Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-7 sm:p-8">
          <div className="mb-6 space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? "احجز موعدك أونلاين" : "Book an Appointment"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isAr
                ? "اختر اليوم المناسب وأدخل بياناتك لاستلام رسالة تأكيد نصية فوراً."
                : "Select an available clinic date and enter your mobile number for instant SMS confirmation."}
            </p>
          </div>

          <BookingWidget doctors={allDoctors} initialDoctorId={doctor._id} />
        </div>
      </div>
    </div>
  );
}
