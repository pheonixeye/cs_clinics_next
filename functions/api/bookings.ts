import { processBooking } from "../../src/lib/booking-service";

type PagesEnv = Record<string, string>;

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
  // Shared helpers read process.env; Pages exposes bindings via `env`.
  type ProcessLike = { env: Record<string, string | undefined> };
  const globalWithProcess = globalThis as unknown as { process?: ProcessLike };
  if (!globalWithProcess.process) {
    globalWithProcess.process = { env: {} };
  }
  const runtimeEnv = globalWithProcess.process.env;
  for (const [key, value] of Object.entries(env)) {
    runtimeEnv[key] = value;
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

  const result = await processBooking(body);
  return Response.json(result.body, { status: result.status });
}
