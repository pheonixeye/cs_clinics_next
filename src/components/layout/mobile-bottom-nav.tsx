"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarPlus, Home, Stethoscope } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { locale, openBooking } = useApp();
  const isAr = locale === "ar";

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid h-16 grid-cols-4 items-center">
        <Link
          href="/"
          className={cn(
            "flex min-h-[44px] flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
            pathname === "/"
              ? "text-teal-700 dark:text-teal-400"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          <Home className="h-5 w-5" />
          <span>{isAr ? "الرئيسية" : "Home"}</span>
        </Link>

        <Link
          href="/doctors"
          className={cn(
            "flex min-h-[44px] flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
            pathname.startsWith("/doctors")
              ? "text-teal-700 dark:text-teal-400"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          <Stethoscope className="h-5 w-5" />
          <span>{isAr ? "الأطباء" : "Doctors"}</span>
        </Link>

        <button
          type="button"
          onClick={() => openBooking()}
          className="flex min-h-[44px] flex-col items-center justify-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400 cursor-pointer"
        >
          <CalendarPlus className="h-5 w-5" />
          <span>{isAr ? "حجز" : "Book"}</span>
        </button>

        <Link
          href="/blog"
          className={cn(
            "flex min-h-[44px] flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
            pathname.startsWith("/blog")
              ? "text-teal-700 dark:text-teal-400"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          <BookOpen className="h-5 w-5" />
          <span>{isAr ? "المقالات" : "Articles"}</span>
        </Link>
      </div>
    </nav>
  );
}
