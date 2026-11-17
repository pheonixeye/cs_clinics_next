import type { Metadata } from "next";
import { ContactView } from "@/components/contact/contact-view";

export const metadata: Metadata = {
  title: "Contact & Location in Zahraa El Maadi",
  description:
    "Visit CosmoSurge Clinics at Zahraa El Maadi, El Nada Tower, 13th Sector, Cairo. Open Saturday to Thursday, 4:00 PM to 10:00 PM. Call 02-25165064 or 01021646574.",
};

export default function ContactPage() {
  return <ContactView />;
}
