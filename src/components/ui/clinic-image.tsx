"use client";

import React, { useState } from "react";
import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClinicImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ClinicImage({
  src,
  alt,
  className,
  fallbackTitle,
}: ClinicImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 p-6 text-center text-slate-500 dark:from-slate-800 dark:to-slate-900 dark:text-slate-400",
          className
        )}
      >
        <Stethoscope className="h-8 w-8 text-teal-700 dark:text-teal-400" />
        <span className="text-xs font-medium">{fallbackTitle || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
