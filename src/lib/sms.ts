import { CLINIC_INFO } from "@/data/clinic-info";
import { formatClinicHour, translateDay } from "@/data/doctors";
import type { BookingPayload } from "@/types/clinic";

export interface SmsDispatchResult {
  sent: boolean;
  provider: string;
  recipient: string;
  preview: string;
  httpStatus?: number;
  note?: string;
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

export async function sendBookingConfirmationSms(
  booking: BookingPayload,
  bookingReference: string,
  doctorPersonalPhone?: string
): Promise<SmsDispatchResult> {
  const baseProviderUrl = (
    process.env.SMS_PROVIDER_URL || "https://notifier.drkaz.dev"
  ).replace(/\/$/, "");
  const topic =
    doctorPersonalPhone || process.env.SMS_CLINIC_TOPIC || "01091966224";
  const apiKey = process.env.SMS_PROVIDER_API_KEY || "";
  const authHeader = process.env.SMS_PROVIDER_AUTH_HEADER || "Authorization";
  const senderId = process.env.SMS_SENDER_ID || "CosmoSurge";

  const messageText = buildConfirmationSmsText(booking, bookingReference);

  // Supports both custom notifier.drkaz.dev query convention and generic REST SMS webhooks
  const targetUrl = baseProviderUrl.includes("notifier.drkaz.dev")
    ? `${baseProviderUrl}&topic=${encodeURIComponent(topic)}`
    : baseProviderUrl;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers[authHeader] =
      authHeader.toLowerCase() === "authorization" &&
      !apiKey.toLowerCase().startsWith("bearer ")
        ? `Bearer ${apiKey}`
        : apiKey;
  }

  const requestBody = {
    // Custom provider standard fields
    to: booking.patientPhone,
    sender: senderId,
    message: messageText,
    bookingReference,
    // Compatibility fields matching cs-clinics notifier
    docid: booking.doctorId,
    docname: booking.doctorName,
    clinic: booking.clinic,
    name: booking.patientName,
    phone: booking.patientPhone,
    dob: booking.dateOfBirth || "",
    date: booking.appointmentDate,
    schedule: {
      day: booking.scheduleDay,
      start: booking.scheduleStart,
      end: booking.scheduleEnd,
    },
  };

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      return {
        sent: true,
        provider: baseProviderUrl,
        recipient: booking.patientPhone,
        preview: messageText,
        httpStatus: response.status,
      };
    }

    return {
      sent: false,
      provider: baseProviderUrl,
      recipient: booking.patientPhone,
      preview: messageText,
      httpStatus: response.status,
      note: `SMS provider responded with HTTP ${response.status}`,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "SMS provider unreachable";
    return {
      sent: false,
      provider: baseProviderUrl,
      recipient: booking.patientPhone,
      preview: messageText,
      note: `SMS dispatch queued (${message})`,
    };
  }
}
