export type Locale = "en" | "ar";
export type ThemeMode = "light" | "dark";

export interface DoctorSchedule {
  day: string;
  intday: number; // 1 = Monday ... 7 = Sunday
  start: number;  // 24-hour format e.g. 19
  end: number;    // 24-hour format e.g. 22
}

export interface DoctorReview {
  id?: string;
  author: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface Doctor {
  _id: number;
  docname: string;
  docname_a: string;
  clinic: string;
  clinic_a: string;
  phone_per: string;
  phone_ass: string;
  procedures: string[];
  procedures_a: string[];
  titles: string[];
  titles_a: string[];
  affiliates: string[];
  affiliates_a: string[];
  fields: string[];
  grid: boolean;
  published: boolean;
  schedule: DoctorSchedule[];
  reviews: DoctorReview[];
}

export interface ArticleSection {
  heading: string;
  heading_a: string;
  paragraphs: string[];
  paragraphs_a: string[];
}

export interface ArticleFaq {
  question: string;
  question_a: string;
  answer: string;
  answer_a: string;
}

export interface Article {
  slug: string;
  title: string;
  title_a: string;
  excerpt: string;
  excerpt_a: string;
  category: string;
  category_a: string;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  coverImage: string;
  coverAlt: string;
  authorId: number;
  authorName: string;
  authorName_a: string;
  authorTitle: string;
  authorTitle_a: string;
  keywords: string[];
  sections: ArticleSection[];
  faqs: ArticleFaq[];
}

export interface BookingPayload {
  doctorId: number;
  doctorName: string;
  doctorNameAr?: string;
  clinic: string;
  clinicAr?: string;
  procedure: string;
  scheduleDay: string;
  scheduleStart: number;
  scheduleEnd: number;
  appointmentDate: string; // ISO YYYY-MM-DD
  patientName: string;
  patientPhone: string;
  dateOfBirth?: string;
  notes?: string;
  locale: Locale;
}

export interface SmsDispatchResult {
  sent: boolean;
  provider: string;
  recipient: string;
  preview: string;
  httpStatus?: number;
  note?: string;
}

export interface BookingResponse {
  success: boolean;
  bookingReference: string;
  pocketbase: {
    persisted: boolean;
    recordId: string | null;
    collection: string;
    endpoint: string;
    note?: string;
  };
  sms: {
    sent: boolean;
    provider: string;
    recipient: string;
    preview: string;
    httpStatus?: number;
    note?: string;
  };
  notifications: {
    doctor: SmsDispatchResult | null;
    assistant: SmsDispatchResult | null;
  };
  booking: BookingPayload & {
    createdAt: string;
    status: "confirmed";
  };
}
