import { getDoctorById } from "../data/doctors";
import { saveBookingToPocketBase } from "./pocketbase";
import { sendBookingSmsNotifications, type SmsEnv } from "./sms";
import type { BookingPayload } from "../types/clinic";

export interface BookingServiceResponse {
  status: number;
  body: Record<string, unknown>;
}

function generateBookingReference(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CS-${num}`;
}

function isValidEgyptianOrIntlPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s()-]/g, "");
  return /^01[0125]\d{8}$/.test(cleaned) || /^\+?[1-9]\d{9,14}$/.test(cleaned);
}

/** Portable booking handler shared with the Cloudflare Pages Function. */
export async function processBooking(
  body: Partial<BookingPayload>,
  env: SmsEnv = {}
): Promise<BookingServiceResponse> {
  if (!body.patientName || body.patientName.trim().length < 2) {
    return {
      status: 400,
      body: {
        error: "Missing Contact Information",
        message: "Please enter the patient's full name.",
      },
    };
  }

  if (!body.patientPhone || !isValidEgyptianOrIntlPhone(body.patientPhone)) {
    return {
      status: 400,
      body: {
        error: "Invalid Phone Number",
        message:
          "Please enter a valid 11-digit Egyptian mobile number (e.g. 010xxxxxxxx).",
      },
    };
  }

  if (
    !body.doctorId ||
    !body.appointmentDate ||
    !body.scheduleDay ||
    body.scheduleStart === undefined ||
    body.scheduleEnd === undefined
  ) {
    return {
      status: 400,
      body: {
        error: "Incomplete Appointment Details",
        message: "Please select a clinic day and appointment date.",
      },
    };
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

  try {
    const [pocketbaseResult, smsResults] = await Promise.all([
      saveBookingToPocketBase(normalizedPayload, bookingReference),
      sendBookingSmsNotifications(
        normalizedPayload,
        bookingReference,
        {
          personal: doctor?.phone_per,
          assistant: doctor?.phone_ass,
        },
        env
      ),
    ]);

    return {
      status: 201,
      body: {
        success: true,
        bookingReference,
        pocketbase: pocketbaseResult,
        sms: smsResults.patient,
        notifications: {
          doctor: smsResults.doctor,
          assistant: smsResults.assistant,
        },
        booking: {
          ...normalizedPayload,
          createdAt: new Date().toISOString(),
          status: "confirmed",
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: "Booking Processing Failed",
        message:
          error instanceof Error ? error.message : "Unable to process booking request.",
      },
    };
  }
}
