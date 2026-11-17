"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { DoctorAvatar } from "@/components/doctors/doctor-avatar";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import {
  formatClinicHour,
  translateDay,
} from "@/data/doctors";
import type { Doctor } from "@/types/clinic";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { locale, openBooking } = useApp();
  const isAr = locale === "ar";

  const displayName = isAr ? `د. ${doctor.docname_a}` : `Dr. ${doctor.docname}`;
  const displayClinic = isAr ? doctor.clinic_a : doctor.clinic;
  const displayTitle = isAr
    ? doctor.titles_a[0] || doctor.clinic_a
    : doctor.titles[0] || doctor.clinic;

  const firstSchedule = doctor.schedule[0];
  const activeDaysText = doctor.schedule
    .map((s) => translateDay(s.day, locale, true))
    .join(" · ");

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <DoctorAvatar
            doctorId={doctor._id}
            name={doctor.docname}
            alt={displayName}
            size="card"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
              {displayClinic}
            </p>
            <h3 className="mt-0.5 truncate text-lg font-semibold text-slate-900 dark:text-white">
              <Link
                href={`/doctors/${doctor._id}`}
                className="hover:text-teal-700 dark:hover:text-teal-400"
              >
                {displayName}
              </Link>
            </h3>
            <p className="mt-1 line-clamp-1 text-sm text-slate-600 dark:text-slate-400">
              {displayTitle}
            </p>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-3.5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{activeDaysText}</span>
          </div>
          {firstSchedule && (
            <div className="flex items-center gap-2 font-mono-tabular">
              <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                {formatClinicHour(firstSchedule.start, locale)} –{" "}
                {formatClinicHour(firstSchedule.end, locale)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2.5 pt-2">
        <Button
          type="button"
          size="sm"
          className="flex-1"
          onClick={() => openBooking(doctor._id)}
        >
          {isAr ? "احجز الآن" : "Book Visit"}
        </Button>
        <Link
          href={`/doctors/${doctor._id}`}
          className="inline-flex min-h-[40px] items-center justify-center gap-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white whitespace-nowrap shrink-0"
        >
          <span>{isAr ? "التفاصيل" : "Profile"}</span>
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </article>
  );
}
