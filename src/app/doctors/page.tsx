import type { Metadata } from "next";
import { DoctorsDirectory } from "@/components/doctors/doctors-directory";
import { DoctorsPageHeader } from "@/components/doctors/doctors-page-header";
import { getDoctors } from "@/lib/pocketbase";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Doctors & Specialists in Zahraa El Maadi",
  description:
    "Browse 10 medical and surgical specialists at CosmoSurge Clinics in Zahraa El Maadi, Cairo. Check weekly schedules and book online.",
};

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
      <DoctorsPageHeader count={doctors.length} />
      <DoctorsDirectory doctors={doctors} />
    </div>
  );
}
