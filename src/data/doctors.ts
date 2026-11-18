import type { Doctor, Locale } from "../types/clinic";

export const DOCTORS_DATA: Doctor[] = [
  {
    _id: 111111,
    docname: "Kareem Zaher",
    docname_a: "كريم زاهر",
    clinic: "Urology",
    clinic_a: "مسالك بولية وذكورة",
    phone_per: "01091966224",
    phone_ass: "01021646574",
    procedures: ["Consultation", "Follow Up"],
    procedures_a: ["كشف", "استشارة"],
    titles: [
      "Urology And Andrology Consultant",
      "MSc in Urology",
      "Member of E.U.A.",
    ],
    titles_a: [
      "استشارى جراحة المسالك البولية والذكورة",
      "ماجستير جراحة المسالك البولية",
      "عضو الجمعية الأوروبية لجراحة المسالك البولية",
    ],
    affiliates: ["Walk in", "Vezeeta", "Clinido"],
    affiliates_a: ["كشف عادي", "فيزيتا", "كلينيدو"],
    fields: [],
    grid: true,
    published: true,
    schedule: [
      { day: "Saturday", intday: 6, start: 20, end: 23 },
      { day: "Tuesday", intday: 2, start: 20, end: 23 },
      { day: "Wednesday", intday: 3, start: 20, end: 23 },
      { day: "Thursday", intday: 4, start: 20, end: 23 },
    ],
    reviews: [],
  },
  {
    _id: 222222,
    docname: "Waleed Abd El Ghany",
    docname_a: "وليد عبد الغني",
    clinic: "Dentistry",
    clinic_a: "طب وجراحة الأسنان",
    phone_per: "01115955600",
    phone_ass: "01021646574",
    procedures: ["Consultation", "Follow Up"],
    procedures_a: ["كشف", "استشارة"],
    titles: ["Dentistry Specialist"],
    titles_a: ["أخصائي طب وجراحة الأسنان"],
    affiliates: ["Vezeeta"],
    affiliates_a: ["فيزيتا"],
    fields: ["History", "Examination"],
    grid: true,
    published: true,
    schedule: [
      { day: "Saturday", intday: 6, start: 18, end: 22 },
      { day: "Sunday", intday: 7, start: 18, end: 22 },
      { day: "Monday", intday: 1, start: 18, end: 22 },
      { day: "Wednesday", intday: 3, start: 18, end: 22 },
      { day: "Thursday", intday: 4, start: 18, end: 22 },
    ],
    reviews: [],
  },
  {
    _id: 333333,
    docname: "Mona Salah",
    docname_a: "منى صلاح",
    clinic: "Dermatology",
    clinic_a: "جلدية وتجميل",
    phone_per: "01272997753",
    phone_ass: "01021646574",
    procedures: ["Consultation"],
    procedures_a: ["كشف"],
    titles: ["Dermatology Specialist"],
    titles_a: ["أخصائي الأمراض الجلدية والتجميل"],
    affiliates: [],
    affiliates_a: [],
    fields: [],
    grid: true,
    published: true,
    schedule: [
      { day: "Sunday", intday: 7, start: 18, end: 22 },
      { day: "Tuesday", intday: 2, start: 18, end: 21 },
    ],
    reviews: [],
  },
  {
    _id: 444444,
    docname: "Mostafa El Dweek",
    docname_a: "مصطفى الدويك",
    clinic: "Pediatrics",
    clinic_a: "أطفال وحديثي الولادة",
    phone_per: "01014637234",
    phone_ass: "01021646574",
    procedures: ["Consultation"],
    procedures_a: ["كشف"],
    titles: ["Consultant Pediatrician"],
    titles_a: ["استشاري الأطفال وحديثي الولادة"],
    affiliates: [],
    affiliates_a: [],
    fields: [],
    grid: true,
    published: true,
    schedule: [
      { day: "Sunday", intday: 7, start: 18, end: 22 },
      { day: "Tuesday", intday: 2, start: 18, end: 22 },
      { day: "Thursday", intday: 4, start: 18, end: 22 },
    ],
    reviews: [],
  },
  {
    _id: 555555,
    docname: "Ahmed Mahmoud",
    docname_a: "أحمد محمود",
    clinic: "Orthopedics",
    clinic_a: "جراحة العظام",
    phone_per: "01006779295",
    phone_ass: "01021646574",
    procedures: ["Consultation"],
    procedures_a: ["كشف"],
    titles: ["Consultant Orthopedic Surgeon"],
    titles_a: ["استشاري جراحة العظام"],
    affiliates: [],
    affiliates_a: [],
    fields: [],
    grid: true,
    published: true,
    schedule: [
      { day: "Saturday", intday: 6, start: 18, end: 22 },
      { day: "Monday", intday: 1, start: 18, end: 22 },
      { day: "Wednesday", intday: 3, start: 18, end: 22 },
    ],
    reviews: [],
  },
  {
    _id: 666666,
    docname: "Mostafa El Deeb",
    docname_a: "مصطفى الديب",
    clinic: "Otolaryngology (E.N.T.)",
    clinic_a: "أنف وأذن وحنجرة",
    phone_per: "01009688380",
    phone_ass: "01021646574",
    procedures: ["Consultation"],
    procedures_a: ["كشف"],
    titles: ["E.N.T. Specialist"],
    titles_a: ["أخصائي الأنف والأذن والحنجرة"],
    affiliates: [],
    affiliates_a: [],
    fields: [],
    grid: true,
    published: true,
    schedule: [
      { day: "Saturday", intday: 6, start: 15, end: 18 },
      { day: "Tuesday", intday: 2, start: 15, end: 18 },
    ],
    reviews: [],
  },
  {
    _id: 777777,
    docname: "Khaled Nabil",
    docname_a: "خالد نبيل",
    clinic: "Plastic Surgery",
    clinic_a: "جراحة التجميل",
    phone_per: "01063046646",
    phone_ass: "01021646574",
    procedures: ["Consultation"],
    procedures_a: ["كشف"],
    titles: ["Plastic Surgery Specialist"],
    titles_a: ["أخصائي جراحة التجميل"],
    affiliates: [],
    affiliates_a: [],
    fields: [],
    grid: true,
    published: true,
    schedule: [
      { day: "Wednesday", intday: 3, start: 19, end: 21 },
    ],
    reviews: [],
  },
  {
    _id: 888888,
    docname: "Mostafa Sami",
    docname_a: "مصطفي سامي",
    clinic: "NeuroSurgery",
    clinic_a: "جراحة المخ و الاعصاب",
    phone_per: "01007497291",
    phone_ass: "01021646574",
    procedures: ["Consultation"],
    procedures_a: ["كشف"],
    titles: ["Neurosurgery Consultant"],
    titles_a: ["استشارى جراحة المخ و الاعصاب"],
    affiliates: [],
    affiliates_a: [],
    fields: [],
    grid: true,
    published: true,
    schedule: [
    { day: "Saturday", intday: 7, start: 19, end: 21 },
    { day: "Tuesday", intday: 2, start: 19, end: 21 },
    ],
    reviews: [],
  },
  {
    _id: 999999,
    docname: "Hatem El Basiony",
    docname_a: "حاتم البسيوني",
    clinic: "Vascular Surgery",
    clinic_a: "جراحة الأوعية والقدم السكري",
    phone_per: "01003775969",
    phone_ass: "01021646574",
    procedures: ["Consultation"],
    procedures_a: ["كشف"],
    titles: ["Vascular Surgery Consultant"],
    titles_a: ["استشاري جراحة الأوعية الدموية والقدم السكري"],
    affiliates: [],
    affiliates_a: [],
    fields: [],
    grid: true,
    published: true,
    schedule: [
      { day: "Sunday", intday: 7, start: 19, end: 21 },
      { day: "Thursday", intday: 4, start: 19, end: 21 },
    ],
    reviews: [],
  },
  {
    _id: 123456,
    docname: "Ali Hetiba",
    docname_a: "علي حطيبة",
    clinic: "Cardiothoracic Surgery",
    clinic_a: "جراحة القلب والصدر",
    phone_per: "01065034359",
    phone_ass: "01021646574",
    procedures: ["Consultation"],
    procedures_a: ["كشف"],
    titles: ["Cardiothoracic Surgery Consultant"],
    titles_a: ["استشاري جراحة القلب والصدر"],
    affiliates: [],
    affiliates_a: [],
    fields: [],
    grid: true,
    published: true,
    schedule: [
      { day: "Sunday", intday: 7, start: 20, end: 21 },
      { day: "Thursday", intday: 4, start: 20, end: 21 },
    ],
    reviews: [],
  },
  {
    _id: 234567,
    docname: "Michelle Elias",
    docname_a: "ميشيل الياس",
    clinic: "Gastroenterology",
    clinic_a: "الجهاز الهضمي",
    phone_per: "01005317057",
    phone_ass: "01021646574",
    procedures: ["Consultation"],
    procedures_a: ["كشف"],
    titles: ["Gastroeneterology Consultant"],
    titles_a: ["استشاري الجهاز الهضمي و المناظير"],
    affiliates: [],
    affiliates_a: [],
    fields: [],
    grid: true,
    published: true,
    schedule: [
      { day: "Monday", intday: 1, start: 19, end: 22 },
      { day: "Thursday", intday: 4, start: 19, end: 22 },
    ],
    reviews: [],
  },
];

const DAY_TRANSLATIONS: Record<string, string> = {
  Saturday: "السبت",
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
};

const SHORT_DAY: Record<string, { en: string; ar: string }> = {
  Saturday: { en: "Sat", ar: "سبت" },
  Sunday: { en: "Sun", ar: "أحد" },
  Monday: { en: "Mon", ar: "إثنين" },
  Tuesday: { en: "Tue", ar: "ثلاثاء" },
  Wednesday: { en: "Wed", ar: "أربعاء" },
  Thursday: { en: "Thu", ar: "خميس" },
  Friday: { en: "Fri", ar: "جمعة" },
};

export function translateDay(day: string, locale: Locale, short = false): string {
  if (short && SHORT_DAY[day]) {
    return SHORT_DAY[day][locale];
  }
  if (locale === "ar") {
    return DAY_TRANSLATIONS[day] ?? day;
  }
  return day;
}

export function formatClinicHour(hour: number, locale: Locale): string {
  if (hour === 0 || hour === 24) {
    return locale === "ar" ? "١٢:٠٠ ص" : "12:00 AM";
  }
  if (hour === 12) {
    return locale === "ar" ? "١٢:٠٠ م" : "12:00 PM";
  }
  if (hour > 12) {
    const h = hour - 12;
    return locale === "ar" ? `${h}:00 م` : `${h}:00 PM`;
  }
  return locale === "ar" ? `${hour}:00 ص` : `${hour}:00 AM`;
}

export function getDoctorInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function getDoctorById(id: number): Doctor | undefined {
  return DOCTORS_DATA.find((d) => d._id === id);
}
