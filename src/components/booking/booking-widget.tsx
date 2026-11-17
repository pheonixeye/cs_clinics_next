"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle2, Clock, MessageSquare, Phone, User } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { CLINIC_INFO } from "@/data/clinic-info";
import { formatClinicHour, translateDay } from "@/data/doctors";
import { cn } from "@/lib/utils";
import type { BookingResponse, Doctor, DoctorSchedule } from "@/types/clinic";

interface BookingWidgetProps {
  doctors: Doctor[];
  initialDoctorId?: number | null;
  compact?: boolean;
  onSuccess?: (result: BookingResponse) => void;
}

const JS_DAY_TO_SCHEDULE_DAY: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function getUpcomingDatesForSchedule(schedule: DoctorSchedule[], count = 8) {
  const results: Array<{
    iso: string;
    labelEn: string;
    labelAr: string;
    schedule: DoctorSchedule;
  }> = [];

  const activeDays = new Map<string, DoctorSchedule>();
  for (const s of schedule) {
    activeDays.set(s.day, s);
  }

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < 35 && results.length < count; i++) {
    const d = new Date(cursor);
    d.setDate(cursor.getDate() + i);
    const dayName = JS_DAY_TO_SCHEDULE_DAY[d.getDay()];
    const matched = activeDays.get(dayName);
    if (matched) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      results.push({
        iso: `${yyyy}-${mm}-${dd}`,
        labelEn: d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        labelAr: d.toLocaleDateString("ar-EG", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        schedule: matched,
      });
    }
  }

  return results;
}

export function BookingWidget({
  doctors,
  initialDoctorId,
  compact = false,
  onSuccess,
}: BookingWidgetProps) {
  const { locale } = useApp();
  const isAr = locale === "ar";

  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(
    initialDoctorId || doctors[0]?._id || 111111
  );

  useEffect(() => {
    if (initialDoctorId) {
      setSelectedDoctorId(initialDoctorId);
    }
  }, [initialDoctorId]);

  const activeDoctor = useMemo(
    () => doctors.find((d) => d._id === selectedDoctorId) || doctors[0],
    [doctors, selectedDoctorId]
  );

  const upcomingSlots = useMemo(
    () => (activeDoctor ? getUpcomingDatesForSchedule(activeDoctor.schedule, 6) : []),
    [activeDoctor]
  );

  const [selectedDateIso, setSelectedDateIso] = useState<string>("");
  const [selectedProcedure, setSelectedProcedure] = useState<string>("Consultation");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingResponse | null>(null);

  useEffect(() => {
    if (upcomingSlots.length > 0) {
      setSelectedDateIso(upcomingSlots[0].iso);
    }
    if (activeDoctor?.procedures.length) {
      setSelectedProcedure(activeDoctor.procedures[0]);
    }
  }, [activeDoctor, upcomingSlots]);

  const selectedSlot = useMemo(
    () => upcomingSlots.find((s) => s.iso === selectedDateIso) || upcomingSlots[0],
    [upcomingSlots, selectedDateIso]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!patientName.trim() || patientName.trim().length < 2) {
      setErrorMsg(
        isAr
          ? "برجاء إدخال الاسم الكامل للمريض."
          : "Please enter the patient's full name."
      );
      return;
    }

    const cleanPhone = patientPhone.replace(/[\s()-]/g, "");
    if (!/^01[0125]\d{8}$/.test(cleanPhone) && !/^\+?[1-9]\d{9,14}$/.test(cleanPhone)) {
      setErrorMsg(
        isAr
          ? "برجاء إدخال رقم موبايل مصري صحيح مكون من ١١ رقم (مثال: 010xxxxxxxx)."
          : "Please enter a valid 11-digit mobile number (e.g., 010xxxxxxxx)."
      );
      return;
    }

    if (!activeDoctor || !selectedSlot) {
      setErrorMsg(
        isAr ? "برجاء اختيار الطبيب والموعد المتاح." : "Please choose a doctor and date."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: activeDoctor._id,
          doctorName: activeDoctor.docname,
          doctorNameAr: activeDoctor.docname_a,
          clinic: activeDoctor.clinic,
          clinicAr: activeDoctor.clinic_a,
          procedure: selectedProcedure,
          scheduleDay: selectedSlot.schedule.day,
          scheduleStart: selectedSlot.schedule.start,
          scheduleEnd: selectedSlot.schedule.end,
          appointmentDate: selectedSlot.iso,
          patientName: patientName.trim(),
          patientPhone: cleanPhone,
          dateOfBirth: dateOfBirth || undefined,
          notes: notes.trim() || undefined,
          locale,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Could not complete booking.");
        return;
      }

      setConfirmation(data as BookingResponse);
      onSuccess?.(data as BookingResponse);
    } catch {
      setErrorMsg(
        isAr
          ? "حدث خطأ في الاتصال. برجاء المحاولة مرة أخرى."
          : "Network error while confirming booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white dark:bg-teal-500 dark:text-slate-950">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
              {isAr ? "تم تأكيد الحجز" : "Appointment Confirmed"}
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {isAr ? `رقم المرجع: ` : `Reference `}
              <span className="font-mono-tabular">{confirmation.bookingReference}</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {isAr
                ? `د/ ${confirmation.booking.doctorNameAr || confirmation.booking.doctorName} · ${confirmation.booking.clinicAr || confirmation.booking.clinic}`
                : `Dr. ${confirmation.booking.doctorName} · ${confirmation.booking.clinic}`}
            </p>
          </div>
        </div>

        <div className="grid gap-3 border-y border-slate-200 py-4 text-sm dark:border-slate-800 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? "التاريخ والمواعيد" : "Date & Clinic Hours"}
            </p>
            <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100 font-mono-tabular">
              {translateDay(confirmation.booking.scheduleDay, locale)} ·{" "}
              {confirmation.booking.appointmentDate}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono-tabular">
              {formatClinicHour(confirmation.booking.scheduleStart, locale)} –{" "}
              {formatClinicHour(confirmation.booking.scheduleEnd, locale)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? "بيانات المريض" : "Patient"}
            </p>
            <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
              {confirmation.booking.patientName}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono-tabular">
              {confirmation.booking.patientPhone}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-2">
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {confirmation.sms.sent
                  ? isAr
                    ? "تم إرسال رسالة SMS للتأكيد بنجاح"
                    : "SMS confirmation dispatched via custom provider"
                  : isAr
                    ? "رسالة التأكيد النصية (قيد الإرسال عبر المزود)"
                    : "SMS notification prepared for dispatch"}
              </p>
              <p className="mt-1 rounded-lg border border-slate-200 bg-white p-2.5 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {confirmation.sms.preview}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {confirmation.pocketbase.persisted
              ? isAr
                ? `تم حفظ الحجز في قاعدة البيانات (${confirmation.pocketbase.recordId})`
                : `Saved to PocketBase (${confirmation.pocketbase.collection} · ${confirmation.pocketbase.recordId})`
              : isAr
                ? "تم تسجيل الموعد محلياً ومزامنته مع خادم PocketBase المحدد."
                : `Recorded locally · PocketBase endpoint: ${confirmation.pocketbase.endpoint}`}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? CLINIC_INFO.addressAr : CLINIC_INFO.address}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setConfirmation(null);
              setPatientName("");
              setPatientPhone("");
              setNotes("");
            }}
          >
            {isAr ? "حجز موعد آخر" : "Book Another Visit"}
          </Button>
          <a
            href={CLINIC_INFO.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {isAr ? "تواصل عبر واتساب" : "WhatsApp Reception"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Specialist selector */}
      <div className="space-y-2">
        <label
          htmlFor="booking-doctor-select"
          className="block text-xs font-medium text-slate-700 dark:text-slate-300"
        >
          {isAr ? "اختر التخصص والطبيب" : "1. Select Specialist"}
        </label>
        <select
          id="booking-doctor-select"
          value={activeDoctor?._id ?? ""}
          onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
          className="flex min-h-[46px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus-visible:ring-teal-400"
        >
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {isAr
                ? `د. ${doc.docname_a} — ${doc.clinic_a}`
                : `Dr. ${doc.docname} — ${doc.clinic}`}
            </option>
          ))}
        </select>
      </div>

      {/* Date selection from active clinic days */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {isAr ? "٢. اختر أقرب موعد متاح" : "2. Select Available Date"}
          </span>
          {selectedSlot && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono-tabular">
              <Clock className="h-3.5 w-3.5" />
              {formatClinicHour(selectedSlot.schedule.start, locale)} –{" "}
              {formatClinicHour(selectedSlot.schedule.end, locale)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {upcomingSlots.map((slot) => {
            const active = selectedSlot?.iso === slot.iso;
            return (
              <button
                key={slot.iso}
                type="button"
                onClick={() => setSelectedDateIso(slot.iso)}
                className={cn(
                  "flex min-h-[54px] flex-col items-start justify-center rounded-xl border px-3 py-2 text-start transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
                  active
                    ? "border-teal-700 bg-teal-700 text-white dark:border-teal-400 dark:bg-teal-500 dark:text-slate-950"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700"
                )}
              >
                <span className="text-xs font-semibold whitespace-nowrap">
                  {isAr ? slot.labelAr : slot.labelEn}
                </span>
                <span
                  className={cn(
                    "mt-0.5 text-[11px] font-mono-tabular",
                    active
                      ? "text-teal-50 dark:text-slate-900"
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {formatClinicHour(slot.schedule.start, locale)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Procedure toggle if doctor has >1 procedure */}
      {activeDoctor && activeDoctor.procedures.length > 1 && (
        <div className="space-y-2">
          <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            {isAr ? "نوع الزيارة" : "Visit Type"}
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {activeDoctor.procedures.map((proc, idx) => {
              const label = isAr ? activeDoctor.procedures_a[idx] || proc : proc;
              const isSelected = selectedProcedure === proc;
              return (
                <button
                  key={proc}
                  type="button"
                  onClick={() => setSelectedProcedure(proc)}
                  className={cn(
                    "min-h-[38px] rounded-lg px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Patient details */}
      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
        <div className="space-y-1.5">
          <label
            htmlFor="patient-name"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <User className="h-3.5 w-3.5 text-slate-400" />
            {isAr ? "اسم المريض *" : "Patient Name *"}
          </label>
          <Input
            id="patient-name"
            name="patientName"
            required
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder={isAr ? "أدخل الاسم الكامل" : "Enter full name"}
            autoComplete="name"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="patient-phone"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            {isAr ? "رقم الموبايل (لتأكيد SMS) *" : "Mobile Number (for SMS) *"}
          </label>
          <Input
            id="patient-phone"
            name="patientPhone"
            type="tel"
            inputMode="tel"
            required
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            placeholder="01012345678"
            className="font-mono-tabular"
            autoComplete="tel"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="patient-dob"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {isAr ? "تاريخ الميلاد (اختياري)" : "Date of Birth (Optional)"}
          </label>
          <Input
            id="patient-dob"
            name="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        {!compact && (
          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="patient-notes"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              {isAr ? "ملاحظات للعيادة (اختياري)" : "Clinical Notes (Optional)"}
            </label>
            <Textarea
              id="patient-notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isAr
                  ? "اذكر أي أعراض أو استفسار مختصر..."
                  : "Briefly mention symptoms or preferred arrival time..."
              }
            />
          </div>
        )}
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-200"
        >
          {errorMsg}
        </div>
      )}

      <div className="space-y-2 pt-1">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? isAr
              ? "جاري تأكيد الحجز..."
              : "Confirming Appointment..."
            : isAr
              ? "تأكيد الحجز وإرسال SMS"
              : "Confirm Appointment & Send SMS"}
        </Button>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          {isAr
            ? "سيتم حفظ الحجز وتأكيده فوراً برسالة نصية SMS"
            : "Your booking is synced to PocketBase and confirmed via SMS."}
        </p>
      </div>
    </form>
  );
}
