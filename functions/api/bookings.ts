import { processBooking } from "../../src/lib/booking-service";

type PagesEnv = Record<string, string>;

const RELEVANT_ENV_KEYS = [
  "APP_URL",
  "BASE_URL",
  "SMS_BASE_URL",
  "USERNAME",
  "SMS_USERNAME",
  "PASSWORD",
  "SMS_PASSWORD",
  "SENDERNAME",
  "SMS_SENDERNAME",
  "POCKETBASE_URL",
  "POCKETBASE_BOOKINGS_COLLECTION",
];

/**
 * Cloudflare Pages Function for POST /api/bookings.
 * The static site is served from `out/`; this function keeps booking writes and
 * SMS dispatch server-side so provider credentials are never exposed to clients.
 */
export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: PagesEnv;
}): Promise<Response> {
  // Diagnostic: log only the NAMES of configured variables, never their values.
  const presentKeys = RELEVANT_ENV_KEYS.filter((key) =>
    typeof env[key] === "string" && env[key].trim().length > 0
  );
  console.log(
    `[bookings] Pages env bindings present: ${presentKeys.length ? presentKeys.join(", ") : "(none)"}`
  );

  // Shared PocketBase helpers read process.env; mirror Pages bindings onto it.
  type ProcessLike = { env: Record<string, string | undefined> };
  const globalWithProcess = globalThis as unknown as { process?: ProcessLike };
  if (!globalWithProcess.process) {
    globalWithProcess.process = { env: {} };
  }
  const runtimeEnv = globalWithProcess.process.env;
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === "string") runtimeEnv[key] = value;
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { error: "Invalid Request", message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  // Pass bindings explicitly so SMS dispatch never depends on a Worker
  // `process.env` polyfill being present.
  const result = await processBooking(body, env);

  const sms = result.body.sms as { sent?: boolean; note?: string } | undefined;
  console.log(
    `[bookings] result: status=${result.status}, smsSent=${sms?.sent ?? "n/a"}${sms?.note ? `, note=${sms.note}` : ""}`
  );

  return Response.json(result.body, { status: result.status });
}
