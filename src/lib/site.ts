const DEFAULT_SITE_URL = "https://cs-clinics.pages.dev";

/** Canonical public origin used for metadata, structured data and the sitemap. */
export function getSiteUrl(): string {
  const configured = process.env.APP_URL;
  const value = configured && configured !== "MY_APP_URL" ? configured : DEFAULT_SITE_URL;
  return value.replace(/\/$/, "");
}

/** Resolve a site-relative asset path to an absolute URL for social/SEO tags. */
export function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${getSiteUrl()}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}
