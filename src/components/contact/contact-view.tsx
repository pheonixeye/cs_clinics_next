"use client";

import React from "react";
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { CLINIC_INFO } from "@/data/clinic-info";

export function ContactView() {
  const { locale, openBooking } = useApp();
  const isAr = locale === "ar";

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
          {isAr ? CLINIC_INFO.branchNameAr : CLINIC_INFO.branchName}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {isAr ? "تواصل مع عيادات كوزموسيرج" : "Contact CosmoSurge Clinics"}
        </h1>
        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {isAr
            ? "يسعد فريق الاستقبال لدينا بالرد على استفساراتكم وحجز المواعيد هاتفياً أو عبر الواتساب."
            : "Reach our Zahraa El Maadi reception desk directly by phone, WhatsApp, or online booking."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3.5 py-5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-400" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isAr ? "العنوان" : "Clinic Address"}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {isAr ? CLINIC_INFO.addressAr : CLINIC_INFO.address}
                </p>
                <a
                  href={CLINIC_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400"
                >
                  <span>{isAr ? "فتح في خرائط جوجل" : "Open in Google Maps"}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5 py-5">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-400" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isAr ? "ساعات العمل" : "Opening Hours"}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {isAr ? CLINIC_INFO.openingHoursAr : CLINIC_INFO.openingHours}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 py-5">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-400" />
              <div className="space-y-1.5">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isAr ? "أرقام الهاتف" : "Phone Numbers"}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-mono-tabular">
                  {isAr ? "الأرضي: " : "Landline: "}
                  <a
                    href={CLINIC_INFO.landlineHref}
                    className="font-semibold text-slate-900 hover:text-teal-700 dark:text-white dark:hover:text-teal-400"
                  >
                    {CLINIC_INFO.landline}
                  </a>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-mono-tabular">
                  {isAr ? "الموبايل: " : "Mobile: "}
                  <a
                    href={CLINIC_INFO.mobileHref}
                    className="font-semibold text-slate-900 hover:text-teal-700 dark:text-white dark:hover:text-teal-400"
                  >
                    {CLINIC_INFO.mobile}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 py-5">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-400" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isAr ? "البريد الإلكتروني" : "Email"}
                </h2>
                <a
                  href={CLINIC_INFO.emailHref}
                  className="mt-1 block text-sm text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400"
                >
                  {CLINIC_INFO.email}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="flex-1" onClick={() => openBooking()}>
              {isAr ? "احجز موعد أونلاين" : "Book Appointment Online"}
            </Button>
            <a
              href={CLINIC_INFO.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <MessageCircle className="h-4 w-4 text-teal-700 dark:text-teal-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="h-full min-h-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
            <iframe
              title="CosmoSurge Clinics Location Map"
              src={CLINIC_INFO.mapsEmbedUrl}
              className="h-full min-h-[380px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
