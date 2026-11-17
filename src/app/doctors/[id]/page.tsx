import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DoctorProfileView } from "@/components/doctors/doctor-profile-view";
import { CLINIC_INFO } from "@/data/clinic-info";
import { DOCTORS_DATA } from "@/data/doctors";
import { getArticles, getDoctors } from "@/lib/pocketbase";

export const revalidate = 300;

export async function generateStaticParams() {
  return DOCTORS_DATA.map((d) => ({ id: String(d._id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const doctors = await getDoctors();
  const doctor = doctors.find((d) => String(d._id) === id);

  if (!doctor) {
    return { title: "Specialist Not Found" };
  }

  const title = `Dr. ${doctor.docname} – ${doctor.clinic}`;
  const description = `Book an appointment with Dr. ${doctor.docname} (${
    doctor.titles[0] || doctor.clinic
  }) at CosmoSurge Clinics, Zahraa El Maadi, Cairo.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
  };
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [doctors, articles] = await Promise.all([getDoctors(), getArticles()]);
  const doctor = doctors.find((d) => String(d._id) === id);

  if (!doctor) {
    notFound();
  }

  const relatedArticles = articles.filter((a) => a.authorId === doctor._id);

  const physicianJsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: `Dr. ${doctor.docname}`,
    medicalSpecialty: doctor.clinic,
    description: doctor.titles.join(", "),
    telephone: CLINIC_INFO.landline,
    worksFor: {
      "@type": "MedicalClinic",
      name: CLINIC_INFO.brandName,
      address: CLINIC_INFO.address,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianJsonLd) }}
      />
      <DoctorProfileView
        doctor={doctor}
        allDoctors={doctors}
        relatedArticles={relatedArticles}
      />
    </>
  );
}
