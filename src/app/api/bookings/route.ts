import { NextRequest, NextResponse } from "next/server";
import { getDoctorById } from "@/data/doctors";
import { saveBookingToPocketBase } from "@/lib/pocketbase";
import { sendBookingConfirmationSms } from "@/lib/sms";
import type { BookingPayload, BookingResponse } from "@/types/clinic";

function generateBookingReference(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CS-${num}`;
}

function isValidEgyptianOrIntlPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s()-]/g, "");
  return /^01[0125]\d{8}$/.test(cleaned) || /^\+?[1-9]\d{9,14}$/.test(cleaned);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<BookingPayload>;

    if (!body.patientName || body.patientName.trim().length < 2) {
      return NextResponse.json(
        {
          error: "Missing Contact Information",
          message: "Please enter the patient's full name.",
        },
        { status: 400 }
      );
    }

    if (!body.patientPhone || !isValidEgyptianOrIntlPhone(body.patientPhone)) {
      return NextResponse.json(
        {
          error: "Invalid Phone Number",
          message:
            "Please enter a valid 11-digit Egyptian mobile number (e.g. 010xxxxxxxx).",
        },
        { status: 400 }
      );
    }

    if (
      !body.doctorId ||
      !body.appointmentDate ||
      !body.scheduleDay ||
      body.scheduleStart === undefined ||
      body.scheduleEnd === undefined
    ) {
      return NextResponse.json(
        {
          error: "Incomplete Appointment Details",
          message: "Please select a clinic day and appointment date.",
        },
        { status: 400 }
      );
    }

    const doctor = getDoctorById(Number(body.doctorId));
    const bookingReference = generateBookingReference();

    const normalizedPayload: BookingPayload = {
      doctorId: Number(body.doctorId),
      doctorName: body.doctorName || doctor?.docname || "Specialist",
      doctorNameAr: body.doctorNameAr || doctor?.docname_a || "",
      clinic: body.clinic || doctor?.clinic || "Clinic",
      clinicAr: body.clinicAr || doctor?.clinic_a || "",
      procedure: body.procedure || doctor?.procedures[0] || "Consultation",
      scheduleDay: body.scheduleDay,
      scheduleStart: Number(body.scheduleStart),
      scheduleEnd: Number(body.scheduleEnd),
      appointmentDate: body.appointmentDate,
      patientName: body.patientName.trim(),
      patientPhone: body.patientPhone.replace(/[\s()-]/g, ""),
      dateOfBirth: body.dateOfBirth?.trim() || "",
      notes: body.notes?.trim() || "",
      locale: body.locale === "ar" ? "ar" : "en",
    };

    const [pocketbaseResult, smsResult] = await Promise.all([
      saveBookingToPocketBase(normalizedPayload, bookingReference),
      sendBookingConfirmationSms(
        normalizedPayload,
        bookingReference,
        doctor?.phone_per
      ),
    ]);

    const response: BookingResponse = {
      success: true,
      bookingReference,
      pocketbase: pocketbaseResult,
      sms: smsResult,
      booking: {
        ...normalizedPayload,
        createdAt: new Date().toISOString(),
        status: "confirmed",
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Booking Processing Failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to process booking request.",
      },
      { status: 500 }
    );
  }
}
