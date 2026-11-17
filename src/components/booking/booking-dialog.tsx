"use client";

import React from "react";
import { BookingWidget } from "@/components/booking/booking-widget";
import { useApp } from "@/components/providers/app-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Doctor } from "@/types/clinic";

export function BookingDialog({ doctors }: { doctors: Doctor[] }) {
  const { isBookingOpen, closeBooking, bookingDoctorId, locale } = useApp();
  const isAr = locale === "ar";

  return (
    <Dialog open={isBookingOpen} onOpenChange={(open) => !open && closeBooking()}>
      <DialogContent>
        <div className="mb-5 pe-8">
          <DialogTitle>
            {isAr ? "حجز موعد بالعيادة" : "Book Clinic Appointment"}
          </DialogTitle>
          <DialogDescription className="mt-1">
            {isAr
              ? "عيادات كوزموسيرج · زهراء المعادي · تأكيد فوري برسالة نصية"
              : "CosmoSurge Clinics · Zahraa El Maadi · Instant SMS confirmation"}
          </DialogDescription>
        </div>

        <BookingWidget
          doctors={doctors}
          initialDoctorId={bookingDoctorId}
          compact
        />
      </DialogContent>
    </Dialog>
  );
}
