"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme, locale, toggleLocale, openBooking } = useApp();
  const isAr = locale === "ar";

  const navLinks = [
    { href: "/doctors", label: isAr ? "الأطباء" : "Doctors" },
    { href: "/blog", label: isAr ? "المقالات" : "Articles" },
    { href: "/#why-cosmosurge", label: isAr ? "عن العيادة" : "About" },
    { href: "/contact", label: isAr ? "التواصل" : "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 md:h-16">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 dark:text-white sm:text-lg"
        >
          {isAr ? "عيادات كوزموسيرج" : "CosmoSurge Clinics"}
        </Link>

        {/* Zone 2: Clean Desktop Navigation Links */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 md:flex"
        >
          {navLinks.map((item) => {
            const active =
              item.href !== "/#why-cosmosurge" &&
              pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium whitespace-nowrap shrink-0 transition-colors hover:text-teal-700 dark:hover:text-teal-400",
                  active
                    ? "text-teal-700 underline underline-offset-8 decoration-2 dark:text-teal-400"
                    : "text-slate-600 dark:text-slate-300"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Theme, Language & Single Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLocale}
            title={isAr ? "Switch to English" : "التبديل إلى العربية"}
            aria-label={isAr ? "Switch to English" : "التبديل للعربية"}
            data-testid="locale-toggle"
            className="inline-flex min-h-[40px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isAr ? "EN" : "عربي"}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            aria-label={
              theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }
            data-testid="theme-toggle"
            className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white shrink-0 cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <Button
            type="button"
            size="sm"
            onClick={() => openBooking()}
            className="hidden sm:inline-flex"
          >
            {isAr ? "احجز موعد" : "Book Visit"}
          </Button>
        </div>
      </div>
    </header>
  );
}
