"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getDoctorInitials } from "@/data/doctors";
import { cn } from "@/lib/utils";

interface DoctorAvatarProps {
  doctorId: number;
  name: string;
  alt: string;
  size?: "card" | "profile";
  className?: string;
}

export function DoctorAvatar({
  doctorId,
  name,
  alt,
  size = "card",
  className,
}: DoctorAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses =
    size === "profile"
      ? "h-20 w-20 rounded-2xl text-lg"
      : "h-14 w-14 rounded-xl text-sm";

  if (hasError) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center border border-slate-200/80 bg-slate-100 font-bold tracking-tight text-teal-800 dark:border-slate-700/80 dark:bg-slate-800 dark:text-teal-300",
          sizeClasses,
          className
        )}
      >
        {getDoctorInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden border border-slate-200/80 bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800",
        sizeClasses,
        className
      )}
    >
      <Image
        src={`/doc_images/${doctorId}.png`}
        alt={alt}
        fill
        sizes={size === "profile" ? "80px" : "56px"}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="object-cover object-top"
      />
    </div>
  );
}
