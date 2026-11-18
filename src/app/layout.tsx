import type { Metadata } from "next";
import { Cairo, DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { BookingDialog } from "@/components/booking/booking-dialog";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppProvider } from "@/components/providers/app-provider";
import { CLINIC_INFO } from "@/data/clinic-info";
import { getDoctors } from "@/lib/pocketbase";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "عيادات كوزموسيرج – رعاية طبية متخصصة في زهراء المعادي | CosmoSurge Clinics",
    template: "%s | عيادات كوزموسيرج",
  },
  description:
    "احجز موعدك أونلاين في عيادات كوزموسيرج بزهراء المعادي عبر ١٠ تخصصات طبية وجراحية مع تأكيد فوري برسالة نصية SMS ومقالات طبية موثقة.",
  openGraph: {
    type: "website",
    siteName: "CosmoSurge Clinics",
    title: "عيادات كوزموسيرج – رعاية طبية متخصصة في زهراء المعادي",
    description:
      "احجز موعدك أونلاين في عيادات كوزموسيرج بزهراء المعادي عبر ١٠ تخصصات طبية مع تأكيد فوري برسالة نصية SMS.",
    images: ["/images/hero_clinic_interior.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "عيادات كوزموسيرج – CosmoSurge Clinics",
    description:
      "احجز موعدك أونلاين في عيادات كوزموسيرج بزهراء المعادي مع تأكيد فوري برسالة نصية SMS.",
    images: ["/images/hero_clinic_interior.jpg"],
  },
};

const clinicJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: CLINIC_INFO.brandName,
  description: CLINIC_INFO.aboutSummary,
  telephone: "+20225165064",
  email: CLINIC_INFO.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "El Nada Tower, 13th Sector, First Floor, Zahraa El Maadi",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: CLINIC_INFO.coordinates.lat,
    longitude: CLINIC_INFO.coordinates.lng,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
      ],
      opens: "16:00",
      closes: "22:00",
    },
  ],
  sameAs: [
    CLINIC_INFO.socials.facebook,
    CLINIC_INFO.socials.instagram,
    CLINIC_INFO.socials.playstore,
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const doctors = await getDoctors();

  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${dmSans.variable} ${cairo.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased dark:bg-[#090D16] dark:text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
        />
        <AppProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <MobileBottomNav />
          <BookingDialog doctors={doctors} />
        </AppProvider>
      </body>
    </html>
  );
}
