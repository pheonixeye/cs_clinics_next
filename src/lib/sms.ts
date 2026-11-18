import { CLINIC_INFO } from "../data/clinic-info";
import { formatClinicHour, translateDay } from "../data/doctors";
import type { BookingPayload, SmsDispatchResult } from "../types/clinic";

export interface BookingSmsResults {
  patient: SmsDispatchResult;
  doctor: SmsDispatchResult | null;
  assistant: SmsDispatchResult | null;
}

export interface DoctorPhones {
  personal?: string;
  assistant?: string;
}

const SMS_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Accept-Language": "en-US",
};

function smsConfig() {
  return {
    baseUrl: (
      process.env.BASE_URL ||
      process.env.SMS_BASE_URL ||
      ""
    )
      .trim()
      .replace(/\/$/, ""),
    username: (process.env.USERNAME || process.env.SMS_USERNAME || "").trim(),
    password: (process.env.PASSWORD || process.env.SMS_PASSWORD || "").trim(),
    senderName: (process.env.SENDERNAME || process.env.SMS_SENDERNAME || "").trim(),
  };
}

/** Build the provider's GET URL: base?username=&password=&sendername=&mobiles=&message= */
function buildProviderUrl(mobile: string, message: string): string | null {
  const { baseUrl, username, password, senderName } = smsConfig();
  if (!baseUrl || !username || !password || !senderName) return null;

  const params = new URLSearchParams({
    username,
    password,
    sendername: senderName,
    mobiles: mobile.replace(/[\s()-]/g, ""),
    message,
  });
  return `${baseUrl}?${params.toString()}`;
}

/** Send one SMS through the configured third-party GET API. */
export async function sendSms(
  mobile: string,
  message: string
): Promise<SmsDispatchResult> {
  const { baseUrl } = smsConfig();
  const targetUrl = buildProviderUrl(mobile, message);

  const result: SmsDispatchResult = {
    sent: false,
    provider: baseUrl,
    recipient: mobile,
    preview: message,
  };

  if (!targetUrl) {
    return {
      ...result,
      note: "SMS provider is not configured (BASE_URL, USERNAME, PASSWORD, SENDERNAME required)",
    };
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: SMS_HEADERS,
      signal: AbortSignal.timeout(5000),
    });

    return {
      ...result,
      sent: response.ok,
      httpStatus: response.status,
      ...(response.ok
        ? {}
        : { note: `SMS provider responded with HTTP ${response.status}` }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "SMS provider unreachable";
    return { ...result, note: `SMS dispatch failed: ${message}` };
  }
}

export function buildConfirmationSmsText(
  booking: BookingPayload,
  bookingReference: string
): string {
  const timeWindow = `${formatClinicHour(booking.scheduleStart, booking.locale)} - ${formatClinicHour(
    booking.scheduleEnd,
    booking.locale
  )}`;

  if (booking.locale === "ar") {
    const dayAr = translateDay(booking.scheduleDay, "ar");
    const docName = booking.doctorNameAr || booking.doctorName;
    return `تم تأكيد حجزك في ${CLINIC_INFO.brandNameAr} (${bookingReference}). د/ ${docName} - ${
      booking.clinicAr || booking.clinic
    }. الموعد: ${dayAr} ${booking.appointmentDate} (${timeWindow}). العنوان: زهراء المعادي، برج الندى. للاستفسار: ${CLINIC_INFO.landline}`;
  }

  return `Confirmed at ${CLINIC_INFO.brandName} (${bookingReference}). Dr. ${booking.doctorName} (${booking.clinic}) on ${booking.scheduleDay}, ${booking.appointmentDate} (${timeWindow}). Zahraa El Maadi, El Nada Tower. Tel: ${CLINIC_INFO.landline}`;
}

/** Internal notification: patient name, phone and appointment date (+ time and reference). */
export function buildStaffNotificationSmsText(
  booking: BookingPayload,
  bookingReference: string,
  includeDoctorName = false
): string {
  const timeWindow = `${formatClinicHour(booking.scheduleStart, booking.locale)} - ${formatClinicHour(
    booking.scheduleEnd,
    booking.locale
  )}`;

  if (booking.locale === "ar") {
    const doctor = includeDoctorName ? ` مع د/ ${booking.doctorNameAr || booking.doctorName}` : "";
    return `حجز جديد${doctor}: ${booking.patientName} - ${booking.patientPhone} - ${booking.appointmentDate} (${timeWindow}). المرجع: ${bookingReference}`;
  }

  const doctor = includeDoctorName ? ` with Dr. ${booking.doctorName}` : "";
  return `New booking${doctor}: ${booking.patientName} - ${booking.patientPhone} - ${booking.appointmentDate} (${timeWindow}). Ref: ${bookingReference}`;
}

/** Send the patient confirmation only (kept for direct callers). */
export async function sendBookingConfirmationSms(
  booking: BookingPayload,
  bookingReference: string
): Promise<SmsDispatchResult> {
  return sendSms(booking.patientPhone, buildConfirmationSmsText(booking, bookingReference));
}

/**
 * Send three notifications in parallel: confirmation to the patient, a booking
 * alert to the doctor's personal phone, and the same alert plus the doctor's
 * name to the doctor's assistant.
 */
export async function sendBookingSmsNotifications(
  booking: BookingPayload,
  bookingReference: string,
  doctorPhones: DoctorPhones = {}
): Promise<BookingSmsResults> {
  const patientMessage = buildConfirmationSmsText(booking, bookingReference);
  const doctorMessage = buildStaffNotificationSmsText(booking, bookingReference);
  const assistantMessage = buildStaffNotificationSmsText(booking, bookingReference, true);

  const [patient, doctorResult, assistantResult] = await Promise.all([
    sendSms(booking.patientPhone, patientMessage),
    doctorPhones.personal ? sendSms(doctorPhones.personal, doctorMessage) : Promise.resolve(null),
    doctorPhones.assistant
      ? sendSms(doctorPhones.assistant, assistantMessage)
      : Promise.resolve(null),
  ]);

  return { patient, doctor: doctorResult, assistant: assistantResult };
}
