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

/** Cloudflare Pages bindings (or process.env) used by the SMS provider. */
export type SmsEnv = Record<string, string | undefined>;

const SMS_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Accept-Language": "en-US",
};

/**
 * Read a variable from the explicit Pages `env` binding first, then fall back
 * to `process.env`. Workers don't always provide a usable `process` global, so
 * explicit bindings are the reliable path in production.
 */
function readEnv(env: SmsEnv, key: string): string {
  const fromBinding = env[key];
  if (typeof fromBinding === "string" && fromBinding.trim()) {
    return fromBinding.trim();
  }

  if (typeof process !== "undefined" && process.env) {
    const fromProcess = process.env[key];
    if (typeof fromProcess === "string" && fromProcess.trim()) {
      return fromProcess.trim();
    }
  }

  return "";
}

function smsConfig(env: SmsEnv = {}) {
  const baseUrl = readEnv(env, "BASE_URL") || readEnv(env, "SMS_BASE_URL");
  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    username: readEnv(env, "USERNAME") || readEnv(env, "SMS_USERNAME"),
    password: readEnv(env, "PASSWORD") || readEnv(env, "SMS_PASSWORD"),
    senderName: readEnv(env, "SENDERNAME") || readEnv(env, "SMS_SENDERNAME"),
  };
}

function missingConfigKeys(config: ReturnType<typeof smsConfig>): string {
  const keys: string[] = [];
  if (!config.baseUrl) keys.push("BASE_URL");
  if (!config.username) keys.push("USERNAME");
  if (!config.password) keys.push("PASSWORD");
  if (!config.senderName) keys.push("SENDERNAME");
  return keys.join(", ");
}

/** Build the provider's GET URL: base?username=&password=&sendername=&mobiles=&message= */
function buildProviderUrl(
  mobile: string,
  message: string,
  env: SmsEnv = {}
): string | null {
  const { baseUrl, username, password, senderName } = smsConfig(env);
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
  message: string,
  env: SmsEnv = {}
): Promise<SmsDispatchResult> {
  const config = smsConfig(env);
  const targetUrl = buildProviderUrl(mobile, message, env);

  const result: SmsDispatchResult = {
    sent: false,
    provider: config.baseUrl,
    recipient: mobile,
    preview: message,
  };

  if (!targetUrl) {
    const missing = missingConfigKeys(config);
    console.error(`[SMS] Not sending to ${mobile}: missing ${missing}`);
    return {
      ...result,
      note: `SMS provider is not configured (missing: ${missing})`,
    };
  }

  console.log(`[SMS] Sending to ${mobile} via ${config.baseUrl}`);

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: SMS_HEADERS,
      signal: AbortSignal.timeout(5000),
    });

    console.log(`[SMS] Provider response for ${mobile}: HTTP ${response.status}`);

    return {
      ...result,
      sent: response.ok,
      httpStatus: response.status,
      ...(response.ok
        ? {}
        : { note: `SMS provider responded with HTTP ${response.status}` }),
    };
  } catch (err) {
    const failureMessage =
      err instanceof Error ? err.message : "SMS provider unreachable";
    console.error(`[SMS] Dispatch failed for ${mobile}: ${failureMessage}`);
    return { ...result, note: `SMS dispatch failed: ${failureMessage}` };
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
  bookingReference: string,
  env: SmsEnv = {}
): Promise<SmsDispatchResult> {
  return sendSms(
    booking.patientPhone,
    buildConfirmationSmsText(booking, bookingReference),
    env
  );
}

/**
 * Send three notifications in parallel: confirmation to the patient, a booking
 * alert to the doctor's personal phone, and the same alert plus the doctor's
 * name to the doctor's assistant.
 */
export async function sendBookingSmsNotifications(
  booking: BookingPayload,
  bookingReference: string,
  doctorPhones: DoctorPhones = {},
  env: SmsEnv = {}
): Promise<BookingSmsResults> {
  const patientMessage = buildConfirmationSmsText(booking, bookingReference);
  const doctorMessage = buildStaffNotificationSmsText(booking, bookingReference);
  const assistantMessage = buildStaffNotificationSmsText(booking, bookingReference, true);

  const [patient, doctorResult, assistantResult] = await Promise.all([
    sendSms(booking.patientPhone, patientMessage, env),
    doctorPhones.personal
      ? sendSms(doctorPhones.personal, doctorMessage, env)
      : Promise.resolve(null),
    doctorPhones.assistant
      ? sendSms(doctorPhones.assistant, assistantMessage, env)
      : Promise.resolve(null),
  ]);

  return { patient, doctor: doctorResult, assistant: assistantResult };
}
