import PocketBase from "pocketbase";
import { ARTICLES_DATA } from "@/data/articles";
import { DOCTORS_DATA } from "@/data/doctors";
import type { Article, BookingPayload, Doctor } from "@/types/clinic";

export function getPocketBaseUrl(): string {
  return (
    process.env.POCKETBASE_URL ||
    process.env.NEXT_PUBLIC_POCKETBASE_URL ||
    "https://server.drkaz.dev"
  ).replace(/\/$/, "");
}

export function getBookingsCollection(): string {
  return process.env.POCKETBASE_BOOKINGS_COLLECTION || "appointments";
}

export function getArticlesCollection(): string {
  return process.env.POCKETBASE_ARTICLES_COLLECTION || "articles";
}

export function getDoctorsCollection(): string {
  return process.env.POCKETBASE_DOCTORS_COLLECTION || "doctors";
}

export async function createPocketBaseClient(): Promise<PocketBase> {
  const pb = new PocketBase(getPocketBaseUrl());
  pb.autoCancellation(false);

  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    try {
      await pb
        .collection("_superusers")
        .authWithPassword(adminEmail, adminPassword, {
          requestKey: null,
        });
    } catch {
      try {
        await pb.admins.authWithPassword(adminEmail, adminPassword, {
          requestKey: null,
        });
      } catch {
        // Continue unauthenticated if admin auth is unavailable
      }
    }
  }

  return pb;
}

export interface PocketBaseSaveResult {
  persisted: boolean;
  recordId: string | null;
  collection: string;
  endpoint: string;
  note?: string;
}

export async function saveBookingToPocketBase(
  payload: BookingPayload,
  bookingReference: string
): Promise<PocketBaseSaveResult> {
  const endpoint = getPocketBaseUrl();
  const collection = getBookingsCollection();

  try {
    const pb = await createPocketBaseClient();
    const recordData = {
      booking_ref: bookingReference,
      docid: payload.doctorId,
      docname: payload.doctorName,
      clinic: payload.clinic,
      procedure: payload.procedure,
      schedule_day: payload.scheduleDay,
      schedule_start: payload.scheduleStart,
      schedule_end: payload.scheduleEnd,
      date: payload.appointmentDate,
      name: payload.patientName.trim(),
      phone: payload.patientPhone.trim(),
      dob: payload.dateOfBirth || "",
      notes: payload.notes || "",
      locale: payload.locale,
      status: "confirmed",
    };

    const created = await pb.collection(collection).create(recordData, {
      requestKey: null,
    });

    return {
      persisted: true,
      recordId: created.id,
      collection,
      endpoint,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "PocketBase request could not be completed";
    return {
      persisted: false,
      recordId: null,
      collection,
      endpoint,
      note: `PocketBase (${endpoint}/api/collections/${collection}/records) returned: ${message}`,
    };
  }
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const FAILURE_BACKOFF_MS = 60 * 1000;

let doctorsCache: { data: Doctor[]; expiresAt: number } | null = null;
let articlesCache: { data: Article[]; expiresAt: number } | null = null;

export async function getDoctors(): Promise<Doctor[]> {
  const now = Date.now();
  if (doctorsCache && doctorsCache.expiresAt > now) {
    return doctorsCache.data;
  }

  const endpoint = getPocketBaseUrl();
  const collection = getDoctorsCollection();

  try {
    const res = await fetch(
      `${endpoint}/api/collections/${collection}/records?perPage=50&filter=(published=true)`,
      {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(750),
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.items) && data.items.length > 0) {
        const mapped = data.items.map((item: Record<string, unknown>) => ({
          _id: Number(item._id ?? item.docid ?? 0),
          docname: String(item.docname ?? ""),
          docname_a: String(item.docname_a ?? item.docname ?? ""),
          clinic: String(item.clinic ?? ""),
          clinic_a: String(item.clinic_a ?? item.clinic ?? ""),
          phone_per: String(item.phone_per ?? ""),
          phone_ass: String(item.phone_ass ?? "01021646574"),
          procedures: Array.isArray(item.procedures)
            ? (item.procedures as string[])
            : ["Consultation"],
          procedures_a: Array.isArray(item.procedures_a)
            ? (item.procedures_a as string[])
            : ["كشف"],
          titles: Array.isArray(item.titles) ? (item.titles as string[]) : [],
          titles_a: Array.isArray(item.titles_a)
            ? (item.titles_a as string[])
            : [],
          affiliates: Array.isArray(item.affiliates)
            ? (item.affiliates as string[])
            : [],
          affiliates_a: Array.isArray(item.affiliates_a)
            ? (item.affiliates_a as string[])
            : [],
          fields: Array.isArray(item.fields) ? (item.fields as string[]) : [],
          grid: Boolean(item.grid ?? true),
          published: Boolean(item.published ?? true),
          schedule: Array.isArray(item.schedule) ? item.schedule : [],
          reviews: Array.isArray(item.reviews) ? item.reviews : [],
        }));
        doctorsCache = { data: mapped, expiresAt: now + CACHE_TTL_MS };
        return mapped;
      }
    }
  } catch {
    // Graceful fallback to verified clinic directory
  }

  doctorsCache = { data: DOCTORS_DATA, expiresAt: now + FAILURE_BACKOFF_MS };
  return DOCTORS_DATA;
}

export async function getArticles(): Promise<Article[]> {
  const now = Date.now();
  if (articlesCache && articlesCache.expiresAt > now) {
    return articlesCache.data;
  }

  const endpoint = getPocketBaseUrl();
  const collection = getArticlesCollection();

  try {
    const res = await fetch(
      `${endpoint}/api/collections/${collection}/records?perPage=50&sort=-publishedAt&filter=(published=true)`,
      {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(750),
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.items) && data.items.length > 0) {
        const pbArticles: Article[] = data.items.map(
          (item: Record<string, unknown>) => ({
            slug: String(item.slug ?? item.id),
            title: String(item.title ?? ""),
            title_a: String(item.title_a ?? item.title ?? ""),
            excerpt: String(item.excerpt ?? ""),
            excerpt_a: String(item.excerpt_a ?? item.excerpt ?? ""),
            category: String(item.category ?? "Medical Guide"),
            category_a: String(item.category_a ?? "مقال طبي"),
            publishedAt: String(
              item.publishedAt ?? item.created ?? new Date().toISOString().slice(0, 10)
            ).slice(0, 10),
            updatedAt: String(
              item.updatedAt ?? item.updated ?? new Date().toISOString().slice(0, 10)
            ).slice(0, 10),
            readTimeMinutes: Number(item.readTimeMinutes ?? 4),
            coverImage: String(
              item.coverImage ?? "/images/clinic_consultation_suite.jpg"
            ),
            coverAlt: String(item.coverAlt ?? item.title ?? "CosmoSurge Medical Article"),
            authorId: Number(item.authorId ?? 111111),
            authorName: String(item.authorName ?? "CosmoSurge Medical Team"),
            authorName_a: String(item.authorName_a ?? "فريق أطباء كوزموسيرج"),
            authorTitle: String(item.authorTitle ?? "Medical Specialist"),
            authorTitle_a: String(item.authorTitle_a ?? "أخصائي طبي"),
            keywords: Array.isArray(item.keywords)
              ? (item.keywords as string[])
              : ["CosmoSurge Clinics", "Maadi Medical Center"],
            sections: Array.isArray(item.sections) ? item.sections : [],
            faqs: Array.isArray(item.faqs) ? item.faqs : [],
          })
        );
        const pbSlugs = new Set(pbArticles.map((a) => a.slug));
        const merged = [
          ...pbArticles,
          ...ARTICLES_DATA.filter((a) => !pbSlugs.has(a.slug)),
        ];
        articlesCache = { data: merged, expiresAt: now + CACHE_TTL_MS };
        return merged;
      }
    }
  } catch {
    // Fallback to curated medical articles
  }

  articlesCache = { data: ARTICLES_DATA, expiresAt: now + FAILURE_BACKOFF_MS };
  return ARTICLES_DATA;
}

export async function getArticleBySlugAsync(
  slug: string
): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
}
