"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DoctorCard } from "@/components/doctors/doctor-card";
import { useApp } from "@/components/providers/app-provider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/types/clinic";

export function DoctorsDirectory({
  doctors,
  limit,
}: {
  doctors: Doctor[];
  limit?: number;
}) {
  const { locale } = useApp();
  const isAr = locale === "ar";

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [query, setQuery] = useState("");

  const specialties = useMemo(() => {
    const map = new Map<string, { en: string; ar: string }>();
    for (const d of doctors) {
      map.set(d.clinic, { en: d.clinic, ar: d.clinic_a });
    }
    return Array.from(map.values());
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = doctors.filter((d) => {
      const matchesSpecialty =
        selectedSpecialty === "all" || d.clinic === selectedSpecialty;
      if (!matchesSpecialty) return false;
      if (!q) return true;
      return (
        d.docname.toLowerCase().includes(q) ||
        d.docname_a.toLowerCase().includes(q) ||
        d.clinic.toLowerCase().includes(q) ||
        d.clinic_a.toLowerCase().includes(q)
      );
    });
    return limit ? list.slice(0, limit) : list;
  }, [doctors, selectedSpecialty, query, limit]);

  return (
    <div className="space-y-6">
      {/* Search and interactive specialty filter tabs */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isAr ? "ابحث باسم الطبيب أو التخصص..." : "Search doctor or specialty..."
            }
            className="ps-10"
            aria-label={isAr ? "بحث عن طبيب" : "Search doctors"}
          />
        </div>

        <div
          role="tablist"
          aria-label={isAr ? "تصفية التخصصات" : "Filter by specialty"}
          className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap"
        >
          <button
            type="button"
            onClick={() => setSelectedSpecialty("all")}
            className={cn(
              "min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer",
              selectedSpecialty === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            {isAr ? "كل التخصصات" : "All Specialties"}
          </button>

          {specialties.map((spec) => {
            const active = selectedSpecialty === spec.en;
            return (
              <button
                key={spec.en}
                type="button"
                onClick={() => setSelectedSpecialty(spec.en)}
                className={cn(
                  "min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer",
                  active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
              >
                {isAr ? spec.ar : spec.en}
              </button>
            );
          })}
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {isAr
            ? "لم يتم العثور على أطباء مطابقين لبحثك."
            : "No specialists match your current filter."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
