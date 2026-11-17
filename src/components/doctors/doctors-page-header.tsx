"use client";

import React from "react";
import { useApp } from "@/components/providers/app-provider";

export function DoctorsPageHeader({ count }: { count: number }) {
  const { locale } = useApp();
  const isAr = locale === "ar";

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
        {isAr
          ? `فرع زهراء المعادي · ${count} تخصصاً طبياً`
          : `Zahraa El Maadi · ${count} Medical & Surgical Clinics`}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {isAr ? "أطباؤنا وجدول العيادات" : "Specialists & Clinic Schedules"}
      </h1>
      <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
        {isAr
          ? "اختر التخصص المناسب، راجع مواعيد التواجد الأسبوعية، واحجز موعدك مباشرة بتأكيد SMS فوري."
          : "Filter by medical specialty, review weekly clinic hours, and confirm your appointment with instant SMS notification."}
      </p>
    </div>
  );
}
