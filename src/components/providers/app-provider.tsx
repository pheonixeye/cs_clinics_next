"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import type { Locale, ThemeMode } from "@/types/clinic";

interface AppContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
  bookingDoctorId: number | null;
  isBookingOpen: boolean;
  openBooking: (doctorId?: number) => void;
  closeBooking: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function safeGetStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }
}

function safeSetStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // Ignore storage restrictions in sandboxed/incognito iframes
    }
  }
}

function applyThemeToDom(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
}

function applyLocaleToDom(lang: Locale) {
  if (typeof document === "undefined") return;
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
  if (document.body) {
    document.body.dir = dir;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [bookingDoctorId, setBookingDoctorId] = useState<number | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const storedTheme = safeGetStorage("cs-theme") as ThemeMode | null;
    const initialTheme: ThemeMode =
      storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";

    setThemeState(initialTheme);
    applyThemeToDom(initialTheme);

    const storedLocale = safeGetStorage("cs-locale") as Locale | null;
    const initialLocale: Locale =
      storedLocale === "en" || storedLocale === "ar" ? storedLocale : "ar";

    setLocaleState(initialLocale);
    applyLocaleToDom(initialLocale);
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    applyThemeToDom(next);
    setThemeState(next);
    safeSetStorage("cs-theme", next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark";
      applyThemeToDom(next);
      safeSetStorage("cs-theme", next);
      return next;
    });
  }, []);

  const setLocale = useCallback((next: Locale) => {
    applyLocaleToDom(next);
    setLocaleState(next);
    safeSetStorage("cs-locale", next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === "en" ? "ar" : "en";
      applyLocaleToDom(next);
      safeSetStorage("cs-locale", next);
      return next;
    });
  }, []);

  const openBooking = useCallback((doctorId?: number) => {
    setBookingDoctorId(doctorId ?? null);
    setIsBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        locale,
        toggleLocale,
        setLocale,
        bookingDoctorId,
        isBookingOpen,
        openBooking,
        closeBooking,
      }}
    >
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={cn(
          "flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 transition-colors duration-150 dark:bg-[#090D16] dark:text-slate-100",
          theme === "dark" && "dark"
        )}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}
